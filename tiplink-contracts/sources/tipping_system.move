module tiplink_contracts::tipping_system {
    use std::string::String;
    use std::signer;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account;
    
    // ================================
    // ERROR CONSTANTS
    // ================================
    
    const E_NOT_INITIALIZED: u64 = 1;
    const E_PROFILE_ALREADY_EXISTS: u64 = 2;
    const E_PROFILE_NOT_FOUND: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;
    const E_INVALID_PROFILE_TYPE: u64 = 5;
    const E_SYSTEM_PAUSED: u64 = 6;
    const E_UNAUTHORIZED: u64 = 7;
    const E_INVALID_AMOUNT: u64 = 8;
    
    // Profile type constants
    const PROFILE_TYPE_RESTAURANT: u8 = 1;
    const PROFILE_TYPE_CREATOR: u8 = 2;
    
    // ================================
    // GLOBAL PLATFORM STATE
    // ================================
    
    struct PlatformConfig has key {
        platform_fee_rate: u64, // 200 = 2%
        platform_treasury: address,
        admin: address,
        paused: bool,
        tip_events: event::EventHandle<TipEvent>,
        profile_events: event::EventHandle<ProfileEvent>,
        total_platform_volume: u64,
        total_platform_fees: u64,
    }
    
    // ================================
    // USER ACCOUNT RESOURCES
    // ================================
    
    struct UserProfile has key {
        owner: address,
        profile_type: u8, // 1 = restaurant, 2 = creator
        total_tips_received: u64,
        total_tips_sent: u64,
        tip_count_received: u64,
        tip_count_sent: u64,
        active: bool,
        created_at: u64,
    }
    
    // ================================
    // EVENTS
    // ================================
    
    struct TipEvent has drop, store {
        tipper: address,
        recipient: address,
        amount: u64,
        platform_fee: u64,
        net_amount: u64,
        timestamp: u64,
        message: String,
        tip_id: u64,
    }
    
    struct ProfileEvent has drop, store {
        owner: address,
        profile_type: u8,
        action: String, // "created", "updated", "deactivated"
        timestamp: u64,
    }

    // ================================
    // INITIALIZATION FUNCTION
    // ================================
    
    public entry fun initialize_platform(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Only allow one initialization
        assert!(!exists<PlatformConfig>(admin_addr), E_NOT_INITIALIZED);
        
        move_to(admin, PlatformConfig {
            platform_fee_rate: 200, // 2%
            platform_treasury: admin_addr,
            admin: admin_addr,
            paused: false,
            tip_events: account::new_event_handle<TipEvent>(admin),
            profile_events: account::new_event_handle<ProfileEvent>(admin),
            total_platform_volume: 0,
            total_platform_fees: 0,
        });
    }

    // ================================
    // PROFILE MANAGEMENT
    // ================================
    
    public entry fun create_profile(
        user: &signer,
        profile_type: u8,
    ) acquires PlatformConfig {
        let user_addr = signer::address_of(user);
        
        // Validate profile type
        assert!(
            profile_type == PROFILE_TYPE_RESTAURANT || profile_type == PROFILE_TYPE_CREATOR, 
            E_INVALID_PROFILE_TYPE
        );
        
        // Ensure profile doesn't already exist
        assert!(!exists<UserProfile>(user_addr), E_PROFILE_ALREADY_EXISTS);
        
        // Create profile in user's account (following TodoList pattern)
        move_to(user, UserProfile {
            owner: user_addr,
            profile_type,
            total_tips_received: 0,
            total_tips_sent: 0,
            tip_count_received: 0,
            tip_count_sent: 0,
            active: true,
            created_at: timestamp::now_microseconds(),
        });
        
        // Emit profile creation event
        let platform_config = borrow_global_mut<PlatformConfig>(@tiplink_contracts);
        event::emit_event(&mut platform_config.profile_events, ProfileEvent {
            owner: user_addr,
            profile_type,
            action: std::string::utf8(b"created"),
            timestamp: timestamp::now_microseconds(),
        });
    }

    // ================================
    // CORE TIPPING FUNCTION
    // ================================
    
    public entry fun send_tip(
        tipper: &signer,
        recipient: address,
        amount: u64,
        message: String,
    ) acquires PlatformConfig, UserProfile {
        let tipper_addr = signer::address_of(tipper);
        let platform_config = borrow_global_mut<PlatformConfig>(@tiplink_contracts);
        
        // Check system is not paused
        assert!(!platform_config.paused, E_SYSTEM_PAUSED);
        
        // Verify minimum amount
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        // Verify recipient has a profile
        assert!(exists<UserProfile>(recipient), E_PROFILE_NOT_FOUND);
        
        // Verify recipient profile is active
        let recipient_profile = borrow_global<UserProfile>(recipient);
        assert!(recipient_profile.active, E_PROFILE_NOT_FOUND);
        
        // Calculate platform fee
        let platform_fee = (amount * platform_config.platform_fee_rate) / 10000;
        let net_amount = amount - platform_fee;
        
        // Transfer funds
        coin::transfer<AptosCoin>(tipper, recipient, net_amount);
        if (platform_fee > 0) {
            coin::transfer<AptosCoin>(tipper, platform_config.platform_treasury, platform_fee);
        };
        
        // Update recipient stats
        let recipient_profile_mut = borrow_global_mut<UserProfile>(recipient);
        recipient_profile_mut.total_tips_received = recipient_profile_mut.total_tips_received + net_amount;
        recipient_profile_mut.tip_count_received = recipient_profile_mut.tip_count_received + 1;
        
        // Update tipper stats (create profile if doesn't exist)
        if (!exists<UserProfile>(tipper_addr)) {
            move_to(tipper, UserProfile {
                owner: tipper_addr,
                profile_type: 0, // Generic tipper, not restaurant or creator
                total_tips_received: 0,
                total_tips_sent: amount,
                tip_count_received: 0,
                tip_count_sent: 1,
                active: true,
                created_at: timestamp::now_microseconds(),
            });
        } else {
            let tipper_profile = borrow_global_mut<UserProfile>(tipper_addr);
            tipper_profile.total_tips_sent = tipper_profile.total_tips_sent + amount;
            tipper_profile.tip_count_sent = tipper_profile.tip_count_sent + 1;
        };
        
        // Update platform stats
        platform_config.total_platform_volume = platform_config.total_platform_volume + amount;
        platform_config.total_platform_fees = platform_config.total_platform_fees + platform_fee;
        
        // Generate unique tip ID
        let tip_id = platform_config.total_platform_volume;
        
        // Emit tip event
        event::emit_event(&mut platform_config.tip_events, TipEvent {
            tipper: tipper_addr,
            recipient,
            amount,
            platform_fee,
            net_amount,
            timestamp: timestamp::now_microseconds(),
            message,
            tip_id,
        });
    }

    // ================================
    // VIEW FUNCTIONS
    // ================================
    
    #[view]
    public fun get_profile(user: address): (address, u8, u64, u64, u64, u64, bool, u64) acquires UserProfile {
        assert!(exists<UserProfile>(user), E_PROFILE_NOT_FOUND);
        let profile = borrow_global<UserProfile>(user);
        (
            profile.owner,
            profile.profile_type,
            profile.total_tips_received,
            profile.total_tips_sent,
            profile.tip_count_received,
            profile.tip_count_sent,
            profile.active,
            profile.created_at
        )
    }
    
    #[view]
    public fun profile_exists(user: address): bool {
        exists<UserProfile>(user)
    }
    
    #[view]
    public fun get_platform_config(): (u64, address, bool, u64, u64) acquires PlatformConfig {
        let config = borrow_global<PlatformConfig>(@tiplink_contracts);
        (
            config.platform_fee_rate,
            config.platform_treasury,
            config.paused,
            config.total_platform_volume,
            config.total_platform_fees
        )
    }
    
    #[view]
    public fun calculate_tip_breakdown(amount: u64): (u64, u64) acquires PlatformConfig {
        let config = borrow_global<PlatformConfig>(@tiplink_contracts);
        let platform_fee = (amount * config.platform_fee_rate) / 10000;
        let net_amount = amount - platform_fee;
        (net_amount, platform_fee)
    }

    // ================================
    // TESTS
    // ================================
    
    #[test(admin = @tiplink_contracts, aptos_framework = @0x1)]
    public entry fun test_platform_initialization(admin: signer, aptos_framework: signer) acquires PlatformConfig {
        account::create_account_for_test(signer::address_of(&admin));
        timestamp::set_time_has_started_for_testing(&aptos_framework);
        initialize_platform(&admin);
        
        let (fee_rate, treasury, paused, volume, fees) = get_platform_config();
        assert!(fee_rate == 200, 1);
        assert!(treasury == signer::address_of(&admin), 2);
        assert!(!paused, 3);
        assert!(volume == 0, 4);
        assert!(fees == 0, 5);
    }
    
    #[test(admin = @tiplink_contracts, restaurant = @0x123, aptos_framework = @0x1)]
    public entry fun test_profile_creation(admin: signer, restaurant: signer, aptos_framework: signer) acquires PlatformConfig, UserProfile {
        account::create_account_for_test(signer::address_of(&admin));
        account::create_account_for_test(signer::address_of(&restaurant));
        timestamp::set_time_has_started_for_testing(&aptos_framework);
        
        initialize_platform(&admin);
        create_profile(&restaurant, PROFILE_TYPE_RESTAURANT);
        
        assert!(profile_exists(signer::address_of(&restaurant)), 1);
        let (owner, profile_type, tips_received, tips_sent, count_received, count_sent, active, _created_at) = 
            get_profile(signer::address_of(&restaurant));
        
        assert!(owner == signer::address_of(&restaurant), 2);
        assert!(profile_type == PROFILE_TYPE_RESTAURANT, 3);
        assert!(tips_received == 0, 4);
        assert!(tips_sent == 0, 5);
        assert!(count_received == 0, 6);
        assert!(count_sent == 0, 7);
        assert!(active, 8);
    }
    
    #[test(admin = @tiplink_contracts, tipper = @0x123, restaurant = @0x456, aptos_framework = @0x1)]
    public entry fun test_tip_flow(admin: signer, tipper: signer, restaurant: signer, aptos_framework: signer) acquires PlatformConfig, UserProfile {
        account::create_account_for_test(signer::address_of(&admin));
        account::create_account_for_test(signer::address_of(&tipper));
        account::create_account_for_test(signer::address_of(&restaurant));
        timestamp::set_time_has_started_for_testing(&aptos_framework);
        
        // Initialize platform
        initialize_platform(&admin);
        
        // Create restaurant profile
        create_profile(&restaurant, PROFILE_TYPE_RESTAURANT);
        
        // Fund tipper account - need to initialize coin first
        aptos_framework::aptos_coin::ensure_initialized_with_apt_fa_metadata_for_test();
        aptos_framework::aptos_coin::mint(&aptos_framework, signer::address_of(&tipper), 1000000); // 0.01 APT
        
        // Send tip
        send_tip(&tipper, signer::address_of(&restaurant), 100000, std::string::utf8(b"Great service!"));
        
        // Check restaurant stats
        let (_, _, tips_received, _, count_received, _, active, _) = get_profile(signer::address_of(&restaurant));
        assert!(tips_received == 98000, 1); // 100000 - 2% fee = 98000
        assert!(count_received == 1, 2);
        assert!(active, 3);
        
        // Check tipper stats
        let (_, _, _, tips_sent, _, count_sent, _, _) = get_profile(signer::address_of(&tipper));
        assert!(tips_sent == 100000, 4);
        assert!(count_sent == 1, 5);
        
        // Check platform stats
        let (_, _, _, volume, fees) = get_platform_config();
        assert!(volume == 100000, 6);
        assert!(fees == 2000, 7); // 2% of 100000
    }
    
    #[test(admin = @tiplink_contracts, user = @0x123, aptos_framework = @0x1)]
    #[expected_failure(abort_code = E_PROFILE_ALREADY_EXISTS)]
    public entry fun test_duplicate_profile_creation(admin: signer, user: signer, aptos_framework: signer) acquires PlatformConfig {
        account::create_account_for_test(signer::address_of(&admin));
        account::create_account_for_test(signer::address_of(&user));
        timestamp::set_time_has_started_for_testing(&aptos_framework);
        
        initialize_platform(&admin);
        create_profile(&user, PROFILE_TYPE_CREATOR);
        create_profile(&user, PROFILE_TYPE_RESTAURANT); // Should fail
    }
} 