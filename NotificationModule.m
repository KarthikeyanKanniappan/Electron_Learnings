#import <Foundation/Foundation.h>
#import <UserNotifications/UserNotifications.h>

void ShowNotification(const char *title, const char *body, const char *iconPath) {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    content.title = [NSString stringWithUTF8String:title];
    content.body = [NSString stringWithUTF8String:body];
    
    UNNotificationSound *sound = [UNNotificationSound defaultSound];
    content.sound = sound;
    
    NSURL *iconURL = [NSURL fileURLWithPath:[NSString stringWithUTF8String:iconPath]];
    UNNotificationAttachment *attachment = [UNNotificationAttachment attachmentWithIdentifier:@"icon" URL:iconURL options:nil error:nil];
    content.attachments = @[attachment];
    
    UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:1 repeats:NO];
    
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"notification" content:content trigger:trigger];
    
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
            NSLog(@"Error showing notification: %@", error);
        }
    }];
}
