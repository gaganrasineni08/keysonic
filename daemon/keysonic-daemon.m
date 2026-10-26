#import <Cocoa/Cocoa.h>
#import <ApplicationServices/ApplicationServices.h>
#import <AudioToolbox/AudioToolbox.h>
#import <sys/socket.h>
#import <netinet/in.h>
#import <arpa/inet.h>
#import <unistd.h>
#import <pthread.h>
#import <stdlib.h>

// Global Configuration
static BOOL g_enabled = YES;
static int g_volume = 85; // 0 - 100
static char g_profile[64] = "holy-panda";
static BOOL g_trusted = NO;
static CFMachPortRef g_eventTap = NULL;

@interface SwitchPack : NSObject
@property (nonatomic, copy) NSString *name;
@property (nonatomic, strong) NSMutableArray<NSSound *> *generics;
@property (nonatomic, strong) NSSound *spaceSound;
@property (nonatomic, strong) NSSound *enterSound;
@property (nonatomic, strong) NSSound *backspaceSound;
@end

@implementation SwitchPack
- (instancetype)init {
    self = [super init];
    if (self) {
        _generics = [NSMutableArray array];
    }
    return self;
}
@end

static NSMutableDictionary<NSString *, SwitchPack *> *g_packs = nil;

static NSString *findSoundsRoot() {
    NSFileManager *fm = [NSFileManager defaultManager];
    NSArray<NSString *> *candidates = @[
        @"public/sounds",
        @"../public/sounds",
        @"../../public/sounds",
        @"/Users/gaganchowdaryrasineni/Desktop/Keyboard sound/public/sounds"
    ];
    for (NSString *candidate in candidates) {
        BOOL isDir = NO;
        if ([fm fileExistsAtPath:candidate isDirectory:&isDir] && isDir) {
            return candidate;
        }
    }
    return @"public/sounds";
}

static SwitchPack *loadPack(NSString *soundsRoot, NSString *folderName) {
    NSString *packDir = [soundsRoot stringByAppendingPathComponent:folderName];
    NSFileManager *fm = [NSFileManager defaultManager];
    if (![fm fileExistsAtPath:packDir]) {
        return nil;
    }

    SwitchPack *pack = [[SwitchPack alloc] init];
    pack.name = folderName;

    NSError *err = nil;
    NSArray<NSString *> *files = [fm contentsOfDirectoryAtPath:packDir error:&err];
    if (err || !files) return nil;

    for (NSString *fname in files) {
        if (![fname hasSuffix:@".mp3"] && ![fname hasSuffix:@".wav"]) continue;
        NSString *filePath = [packDir stringByAppendingPathComponent:fname];
        NSSound *snd = [[NSSound alloc] initWithContentsOfFile:filePath byReference:YES];
        if (!snd) continue;

        NSString *upper = [fname uppercaseString];
        if ([upper containsString:@"SPACE"]) {
            pack.spaceSound = snd;
        } else if ([upper containsString:@"ENTER"]) {
            pack.enterSound = snd;
        } else if ([upper containsString:@"BACKSPACE"] || [upper containsString:@"DELETE"]) {
            pack.backspaceSound = snd;
        } else {
            [pack.generics addObject:snd];
        }
    }

    // Fallbacks if specific keys are missing
    if (!pack.spaceSound && pack.generics.count > 0) pack.spaceSound = pack.generics[0];
    if (!pack.enterSound && pack.generics.count > 0) pack.enterSound = pack.generics.lastObject;
    if (!pack.backspaceSound && pack.generics.count > 0) pack.backspaceSound = pack.generics[0];

    return pack;
}

static void loadAllSwitchPacks() {
    g_packs = [NSMutableDictionary dictionary];
    NSString *root = findSoundsRoot();
    printf("[KeySonic Daemon] Loading authentic sound packs from: %s\n", [root UTF8String]);

    NSArray<NSString *> *folders = @[
        @"holy-panda",
        @"cherry-blue",
        @"nk-cream",
        @"cherry-brown",
        @"cherry-black",
        @"turquoise",
        @"typewriter",
        @"cyber"
    ];

    for (NSString *folder in folders) {
        SwitchPack *pack = loadPack(root, folder);
        if (pack) {
            g_packs[folder] = pack;
            printf("  Loaded pack '%s': %lu generic keys, space: %s, enter: %s, backspace: %s\n",
                   [folder UTF8String],
                   (unsigned long)pack.generics.count,
                   pack.spaceSound ? "YES" : "NO",
                   pack.enterSound ? "YES" : "NO",
                   pack.backspaceSound ? "YES" : "NO");
        }
    }
}

static SwitchPack *getActivePack() {
    NSString *prof = [NSString stringWithUTF8String:g_profile];
    prof = [prof lowercaseString];

    if ([prof containsString:@"blue"]) {
        return g_packs[@"cherry-blue"];
    } else if ([prof containsString:@"cream"]) {
        return g_packs[@"nk-cream"];
    } else if ([prof containsString:@"brown"]) {
        return g_packs[@"cherry-brown"];
    } else if ([prof containsString:@"black"]) {
        return g_packs[@"cherry-black"];
    } else if ([prof containsString:@"typewriter"]) {
        return g_packs[@"typewriter"];
    } else if ([prof containsString:@"cyber"] || [prof containsString:@"future"] || [prof containsString:@"rgb"]) {
        return g_packs[@"cyber"];
    } else if ([prof containsString:@"gaming"] || [prof containsString:@"linear"] || [prof containsString:@"turquoise"]) {
        return g_packs[@"turquoise"];
    }

    // Default to Holy Panda deep tactile thock
    return g_packs[@"holy-panda"] ?: g_packs[@"cherry-blue"];
}

static void onGlobalKeyDown(CGKeyCode keyCode) {
    if (!g_enabled) return;
    if (g_volume <= 0) return;

    SwitchPack *pack = getActivePack();
    if (!pack) return;

    NSSound *selected = nil;

    // macOS key codes
    if (keyCode == 49) { // Spacebar
        selected = pack.spaceSound;
    } else if (keyCode == 36 || keyCode == 76) { // Return / Enter
        selected = pack.enterSound;
    } else if (keyCode == 51 || keyCode == 117) { // Delete / Backspace
        selected = pack.backspaceSound;
    } else {
        if (pack.generics.count > 0) {
            NSUInteger idx = arc4random_uniform((uint32_t)pack.generics.count);
            selected = pack.generics[idx];
        }
    }

    if (!selected && pack.generics.count > 0) {
        selected = pack.generics[0];
    }

    if (selected) {
        @autoreleasepool {
            NSSound *playInstance = [selected copy];
            float vol = (float)g_volume / 100.0f;
            // Spacebar slight physical acoustic weight boost
            if (keyCode == 49) {
                vol = fminf(1.0f, vol * 1.15f);
            }
            [playInstance setVolume:vol];
            [playInstance play];
        }
    }
}

// Global CGEventTap callback
static CGEventRef eventTapCallback(CGEventTapProxy proxy, CGEventType type, CGEventRef event, void *refcon) {
    if (type == kCGEventKeyDown) {
        CGKeyCode keyCode = (CGKeyCode)CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode);
        onGlobalKeyDown(keyCode);
    }
    return event; // Always pass through untouched
}

// Background HTTP IPC Server (127.0.0.1:6123)
static void *httpServerThread(void *arg) {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) return NULL;

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = inet_addr("127.0.0.1");
    address.sin_port = htons(6123);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        close(server_fd);
        return NULL;
    }

    if (listen(server_fd, 10) < 0) {
        close(server_fd);
        return NULL;
    }

    printf("[KeySonic Daemon] IPC HTTP Server listening on http://127.0.0.1:6123\n");

    while (1) {
        int client_fd = accept(server_fd, NULL, NULL);
        if (client_fd < 0) continue;

        char buffer[2048] = {0};
        read(client_fd, buffer, sizeof(buffer) - 1);

        // CORS Preflight
        if (strncmp(buffer, "OPTIONS", 7) == 0) {
            const char *cors = "HTTP/1.1 204 No Content\r\n"
                               "Access-Control-Allow-Origin: *\r\n"
                               "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
                               "Access-Control-Allow-Headers: Content-Type\r\n\r\n";
            write(client_fd, cors, strlen(cors));
            close(client_fd);
            continue;
        }

        // Parse commands
        if (strstr(buffer, "POST /api/toggle") != NULL) {
            g_enabled = !g_enabled;
        } else if (strstr(buffer, "POST /api/enable") != NULL) {
            g_enabled = YES;
        } else if (strstr(buffer, "POST /api/disable") != NULL) {
            g_enabled = NO;
        } else if (strstr(buffer, "/api/set_profile?profile=") != NULL) {
            char *p = strstr(buffer, "/api/set_profile?profile=") + 25;
            char name[64] = {0};
            int i = 0;
            while (*p && *p != ' ' && *p != '&' && i < 63) {
                name[i++] = *p++;
            }
            if (strlen(name) > 0) {
                strncpy(g_profile, name, sizeof(g_profile) - 1);
                printf("[KeySonic Daemon] Active profile switched to: %s\n", g_profile);
            }
        } else if (strstr(buffer, "/api/set_volume?vol=") != NULL) {
            char *p = strstr(buffer, "/api/set_volume?vol=") + 20;
            int v = atoi(p);
            if (v >= 0 && v <= 100) {
                g_volume = v;
                printf("[KeySonic Daemon] Volume set to: %d%%\n", g_volume);
            }
        }

        g_trusted = AXIsProcessTrusted();

        char json[512];
        snprintf(json, sizeof(json),
                 "{\"running\":true,\"enabled\":%s,\"trusted\":%s,\"profile\":\"%s\",\"volume\":%d}",
                 g_enabled ? "true" : "false",
                 g_trusted ? "true" : "false",
                 g_profile,
                 g_volume);

        char response[1024];
        snprintf(response, sizeof(response),
                 "HTTP/1.1 200 OK\r\n"
                 "Content-Type: application/json\r\n"
                 "Access-Control-Allow-Origin: *\r\n"
                 "Content-Length: %zu\r\n\r\n%s",
                 strlen(json), json);

        write(client_fd, response, strlen(response));
        close(client_fd);
    }

    close(server_fd);
    return NULL;
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        printf("========================================\n");
        printf(" KeySonic Native Global Sound Engine\n");
        printf("========================================\n");

        loadAllSwitchPacks();

        // Start background IPC server
        pthread_t thread;
        pthread_create(&thread, NULL, httpServerThread, NULL);

        // Check Accessibility Trust
        NSDictionary *options = @{(__bridge id)kAXTrustedCheckOptionPrompt: @YES};
        g_trusted = AXIsProcessTrustedWithOptions((__bridge CFDictionaryRef)options);
        printf("[KeySonic Daemon] Accessibility Trusted: %s\n",
               g_trusted ? "YES" : "NO (grant access in System Settings > Privacy & Security > Accessibility)");

        // Create Global CGEventTap
        CGEventMask eventMask = (1 << kCGEventKeyDown);
        g_eventTap = CGEventTapCreate(
            kCGSessionEventTap,
            kCGHeadInsertEventTap,
            kCGEventTapOptionListenOnly,
            eventMask,
            eventTapCallback,
            NULL
        );

        if (!g_eventTap) {
            fprintf(stderr, "[KeySonic Daemon] CGEventTap requires Accessibility permission.\n");
        } else {
            CFRunLoopSourceRef runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, g_eventTap, 0);
            CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, kCFRunLoopCommonModes);
            CGEventTapEnable(g_eventTap, true);
            printf("[KeySonic Daemon] System-Wide Hook active! Real mechanical sounds playing across all Mac apps.\n");
        }

        // Retry hook if permission granted later
        dispatch_source_t timer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, dispatch_get_main_queue());
        dispatch_source_set_timer(timer, dispatch_time(DISPATCH_TIME_NOW, 2 * NSEC_PER_SEC), 2 * NSEC_PER_SEC, 0);
        dispatch_source_set_event_handler(timer, ^{
            if (!g_eventTap && AXIsProcessTrusted()) {
                g_trusted = YES;
                CGEventMask mask = (1 << kCGEventKeyDown);
                g_eventTap = CGEventTapCreate(
                    kCGSessionEventTap,
                    kCGHeadInsertEventTap,
                    kCGEventTapOptionListenOnly,
                    mask,
                    eventTapCallback,
                    NULL
                );
                if (g_eventTap) {
                    CFRunLoopSourceRef src = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, g_eventTap, 0);
                    CFRunLoopAddSource(CFRunLoopGetCurrent(), src, kCFRunLoopCommonModes);
                    CGEventTapEnable(g_eventTap, true);
                    printf("[KeySonic Daemon] Global tap engaged!\n");
                }
            }
        });
        dispatch_resume(timer);

        CFRunLoopRun();
    }
    return 0;
}
