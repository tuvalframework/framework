export class IconType {
    public constructor(private title: string, private name: string, private filled: string) {

    }
    public GetTitle(): string {
        return this.title;
    }
    public GetCode(): string {
        return '\\' + this.filled;
    }
}

export const IconLibrary = {
    Search: new IconType('Search', 'search', 'e8b6'),
    Home: new IconType('Home', 'home', 'e88a'),
    AccountCircle: new IconType('Account Circle', 'account_circle', 'e853'),
    Settings: new IconType('Settings', 'settings', 'e8b8'),
    Done: new IconType('Done', 'done', 'e876'),
    Info: new IconType('Info', 'info', 'e88e'),
    CheckCircle: new IconType('Check Circle', 'check_circle', 'e86c'),
    Delete: new IconType('Delete', 'delete', 'e872'),
    ShoppingCart: new IconType('Shopping Cart', 'shopping_cart', 'e8cc'),
    Visibility: new IconType('Visibility', 'visibility', 'e8f4'),
    Favorite: new IconType('Favorite', 'favorite', 'e87d'),
    Logout: new IconType('Logout', 'logout', 'e9ba'),
    Description: new IconType('Description', 'description', 'e873'),
    FavoriteBorder: new IconType('Favorite Border', 'favorite_border', 'e87e'),
    Lock: new IconType('Lock', 'lock', 'e897'),
    Schedule: new IconType('Schedule', 'schedule', 'e8b5'),
    Language: new IconType('Language', 'language', 'e894'),
    Face: new IconType('Face', 'face', 'e87c'),
    HelpOutline: new IconType('Help Outline', 'help_outline', 'e8fd'),
    ManageAccounts: new IconType('Manage Accounts', 'manage_accounts', 'f02e'),
    FilterAlt: new IconType('Filter Alt', 'filter_alt', 'ef4f'),
    Fingerprint: new IconType('Fingerprint', 'fingerprint', 'e90d'),
    Event: new IconType('Event', 'event', 'e878'),
    Verified: new IconType('Verified', 'verified', 'ef76'),
    ThumbUp: new IconType('Thumb Up', 'thumb_up', 'e8dc'),
    Dashboard: new IconType('Dashboard', 'dashboard', 'e871'),
    Login: new IconType('Login', 'login', 'ea77'),
    CalendarToday: new IconType('Calendar Today', 'calendar_today', 'e935'),
    VisibilityOff: new IconType('Visibility Off', 'visibility_off', 'e8f5'),
    List: new IconType('List', 'list', 'e896'),
    CheckCircleOutline: new IconType('Check Circle Outline', 'check_circle_outline', 'e92d'),
    HighlightOff: new IconType('Highlight Off', 'highlight_off', 'e888'),
    Help: new IconType('Help', 'help', 'e887'),
    DateRange: new IconType('Date Range', 'date_range', 'e916'),
    QuestionAnswer: new IconType('Question Answer', 'question_answer', 'e8af'),
    TaskAlt: new IconType('Task Alt', 'task_alt', 'e2e6'),
    Paid: new IconType('Paid', 'paid', 'f041'),
    Article: new IconType('Article', 'article', 'ef42'),
    ShoppingBag: new IconType('Shopping Bag', 'shopping_bag', 'f1cc'),
    Lightbulb: new IconType('Lightbulb', 'lightbulb', 'e0f0'),
    OpenInNew: new IconType('Open In New', 'open_in_new', 'e89e'),
    PermIdentity: new IconType('Perm Identity', 'perm_identity', 'e8a6'),
    TrendingUp: new IconType('Trending Up', 'trending_up', 'e8e5'),
    History: new IconType('History', 'history', 'e889'),
    CreditCard: new IconType('Credit Card', 'credit_card', 'e870'),
    AccountBalance: new IconType('Account Balance', 'account_balance', 'e84f'),
    DeleteOutline: new IconType('Delete Outline', 'delete_outline', 'e92e'),
    ReportProblem: new IconType('Report Problem', 'report_problem', 'e8b2'),
    FactCheck: new IconType('Fact Check', 'fact_check', 'f0c5'),
    Assignment: new IconType('Assignment', 'assignment', 'e85d'),
    VerifiedUser: new IconType('Verified User', 'verified_user', 'e8e8'),
    ArrowRightAlt: new IconType('Arrow Right Alt', 'arrow_right_alt', 'e941'),
    StarRate: new IconType('Star Rate', 'star_rate', 'f0ec'),
    AccountBalanceWallet: new IconType('Account Balance Wallet', 'account_balance_wallet', 'e850'),
    Analytics: new IconType('Analytics', 'analytics', 'ef3e'),
    Autorenew: new IconType('Autorenew', 'autorenew', 'e863'),
    Work: new IconType('Work', 'work', 'e8f9'),
    Build: new IconType('Build', 'build', 'e869'),
    ViewList: new IconType('View List', 'view_list', 'e8ef'),
    Print: new IconType('Print', 'print', 'e8ad'),
    Store: new IconType('Store', 'store', 'e8d1'),
    Today: new IconType('Today', 'today', 'e8df'),
    DeleteForever: new IconType('Delete Forever', 'delete_forever', 'e92b'),
    AdminPanelSettings: new IconType('Admin Panel Settings', 'admin_panel_settings', 'ef3d'),
    LockOpen: new IconType('Lock Open', 'lock_open', 'e898'),
    Savings: new IconType('Savings', 'savings', 'e2eb'),
    Room: new IconType('Room', 'room', 'e8b4'),
    Code: new IconType('Code', 'code', 'e86f'),
    Grade: new IconType('Grade', 'grade', 'e885'),
    Receipt: new IconType('Receipt', 'receipt', 'e8b0'),
    WatchLater: new IconType('Watch Later', 'watch_later', 'e924'),
    Update: new IconType('Update', 'update', 'e923'),
    AddShoppingCart: new IconType('Add Shopping Cart', 'add_shopping_cart', 'e854'),
    ContactSupport: new IconType('Contact Support', 'contact_support', 'e94c'),
    PowerSettingsNew: new IconType('Power Settings New', 'power_settings_new', 'e8ac'),
    Pets: new IconType('Pets', 'pets', 'e91d'),
    DoneAll: new IconType('Done All', 'done_all', 'e877'),
    Explore: new IconType('Explore', 'explore', 'e87a'),
    Bookmark: new IconType('Bookmark', 'bookmark', 'e866'),
    BookmarkBorder: new IconType('Bookmark Border', 'bookmark_border', 'e867'),
    NoteAdd: new IconType('Note Add', 'note_add', 'e89c'),
    Reorder: new IconType('Reorder', 'reorder', 'e8fe'),
    AccountBox: new IconType('Account Box', 'account_box', 'e851'),
    ShoppingBasket: new IconType('Shopping Basket', 'shopping_basket', 'e8cb'),
    PendingActions: new IconType('Pending Actions', 'pending_actions', 'f1bb'),
    DragIndicator: new IconType('Drag Indicator', 'drag_indicator', 'e945'),
    Payment: new IconType('Payment', 'payment', 'e8a1'),
    Launch: new IconType('Launch', 'launch', 'e895'),
    CalendarMonth: new IconType('Calendar Month', 'calendar_month', 'ebcc'),
    SupervisorAccount: new IconType('Supervisor Account', 'supervisor_account', 'e8d3'),
    Pending: new IconType('Pending', 'pending', 'ef64'),
    ZoomIn: new IconType('Zoom In', 'zoom_in', 'e8ff'),
    TouchApp: new IconType('Touch App', 'touch_app', 'e913'),
    Assessment: new IconType('Assessment', 'assessment', 'e85c'),
    ThumbUpOffAlt: new IconType('Thumb Up Off Alt', 'thumb_up_off_alt', 'e9f3'),
    OpenInFull: new IconType('Open In Full', 'open_in_full', 'f1ce'),
    Leaderboard: new IconType('Leaderboard', 'leaderboard', 'f20c'),
    DoneOutline: new IconType('Done Outline', 'done_outline', 'e92f'),
    ExitToApp: new IconType('Exit To App', 'exit_to_app', 'e879'),
    Preview: new IconType('Preview', 'preview', 'f1c5'),
    AssignmentInd: new IconType('Assignment Ind', 'assignment_ind', 'e85e'),
    CardGiftcard: new IconType('Card Giftcard', 'card_giftcard', 'e8f6'),
    ViewInAr: new IconType('View In Ar', 'view_in_ar', 'e9fe'),
    WorkOutline: new IconType('Work Outline', 'work_outline', 'e943'),
    PublishedWithChanges: new IconType('Published With Changes', 'published_with_changes', 'f232'),
    Feedback: new IconType('Feedback', 'feedback', 'e87f'),
    Timeline: new IconType('Timeline', 'timeline', 'e922'),
    Dns: new IconType('Dns', 'dns', 'e875'),
    SwapHoriz: new IconType('Swap Horiz', 'swap_horiz', 'e8d4'),
    SyncAlt: new IconType('Sync Alt', 'sync_alt', 'ea18'),
    AssignmentTurnedIn: new IconType('Assignment Turned In', 'assignment_turned_in', 'e862'),
    FlightTakeoff: new IconType('Flight Takeoff', 'flight_takeoff', 'e905'),
    Stars: new IconType('Stars', 'stars', 'e8d0'),
    Book: new IconType('Book', 'book', 'e865'),
    Label: new IconType('Label', 'label', 'e892'),
    PanTool: new IconType('Pan Tool', 'pan_tool', 'e925'),
    BugReport: new IconType('Bug Report', 'bug_report', 'e868'),
    ContactPage: new IconType('Contact Page', 'contact_page', 'f22e'),
    Gavel: new IconType('Gavel', 'gavel', 'e90e'),
    Cached: new IconType('Cached', 'cached', 'e86a'),
    Alarm: new IconType('Alarm', 'alarm', 'e855'),
    Translate: new IconType('Translate', 'translate', 'e8e2'),
    SpaceDashboard: new IconType('Space Dashboard', 'space_dashboard', 'e66b'),
    Android: new IconType('Android', 'android', 'e859'),
    SupervisedUserCircle: new IconType('Supervised User Circle', 'supervised_user_circle', 'e939'),
    EditCalendar: new IconType('Edit Calendar', 'edit_calendar', 'e742'),
    Accessibility: new IconType('Accessibility', 'accessibility', 'e84e'),
    Minimize: new IconType('Minimize', 'minimize', 'e931'),
    Extension: new IconType('Extension', 'extension', 'e87b'),
    GetApp: new IconType('Get Appe', 'get_app', 'e884'),
    TipsAndUpdates: new IconType('Tips And Updates', 'tips_and_updates', 'e79a'),
    RecordVoiceOver: new IconType('Record Voice Over', 'record_voice_over', 'e91f'),
    AddTask: new IconType('Add Task', 'add_task', 'f23a'),
    TrendingFlat: new IconType('Trending Flat', 'trending_flat', 'e8e4'),
    HourglassEmpty: new IconType('Hourglass Empty', 'hourglass_empty', 'e88b'),
    HelpCenter: new IconType('Help Center', 'help_center', 'f1c0'),
    ThumbDown: new IconType('Thumb Down', 'thumb_down', 'e8db'),
    AccessibilityNew: new IconType('Accessibility New', 'accessibility_new', 'e92c'),
    StickyNote2: new IconType('Sticky Note 2', 'sticky_note_2', 'f1fc'),
    Rule: new IconType('Rule', 'rule', 'f1c2'),
    FlutterDash: new IconType('Flutter Dash', 'flutter_dash', 'e00b'),
    DashboardCustomize: new IconType('Dashboard Customize', 'dashboard_customize', 'e99b'),
    Source: new IconType('Source', 'source', 'f1c4'),
    Support: new IconType('Support', 'support', 'ef73'),
    FindInPage: new IconType('Find In Page', 'find_in_page', 'e880'),
    CloseFullscreen: new IconType('Close Fullscreen', 'close_fullscreen', 'f1cf'),
    SettingsApplications: new IconType('Settings Applications', 'settings_applications', 'e8b9'),
    Redeem: new IconType('Redeem', 'redeem', 'e8b1'),
    ViewHeadline: new IconType('View Headline', 'view_headline', 'e8ee'),
    Announcement: new IconType('Announcement', 'announcement', 'e85a'),
    Loyalty: new IconType('Loyalty', 'loyalty', 'e89a'),
    AdsClick: new IconType('Ads Click', 'ads_click', 'e762'),
    GroupWork: new IconType('Group Work', 'group_work', 'e886'),
    SwapVert: new IconType('Swap Vert', 'swap_vert', 'e8d5'),
    Restore: new IconType('Restore', 'restore', 'e8b3'),
    EuroSymbol: new IconType('Euro Symbol', 'euro_symbol', 'e926'),
    Sensors: new IconType('Sensors', 'sensors', 'e51e'),
    Dangerous: new IconType('Dangerous', 'dangerous', 'e99a'),
    CompareArrows: new IconType('Compare Arrows', 'compare_arrows', 'e915'),
    NightlightRound: new IconType('Nightlight Round', 'nightlight_round', 'ef5e'),
    RocketLaunch: new IconType('Rocket Launch', 'rocket_launch', 'eb9b'),
    PrivacyTip: new IconType('Privacy Tip', 'privacy_tip', 'f0dc'),
    ArrowCircleRight: new IconType('Arrow Circle Right', 'arrow_circle_right', 'eaaa'),
    QuestionMark: new IconType('Question Mark', 'question_mark', 'eb8b'),
    Subject: new IconType('Subject', 'subject', 'e8d2'),
    DisabledByDefault: new IconType('Disabled By Default', 'disabled_by_default', 'f230'),
    TrackChanges: new IconType('Track Changes', 'track_changes', 'e8e1'),
    TableView: new IconType('Table View', 'table_view', 'f1be'),
    Https: new IconType('Https', 'https', 'e88d'),
    Grading: new IconType('Grading', 'grading', 'ea4f'),
    Copyright: new IconType('Copyright', 'copyright', 'e90c'),
    Toc: new IconType('Toc', 'toc', 'e8de'),
    ArrowCircleUp: new IconType('Arrow Circle Up', 'arrow_circle_up', 'f182'),
    Bookmarks: new IconType('Bookmarks', 'bookmarks', 'e98b'),
    Api: new IconType('Api', 'api', 'f1b7'),
    QueryBuilder: new IconType('Query Builder', 'query_builder', 'e8ae'),
    PermMedia: new IconType('Perm Media', 'perm_media', 'e8a7'),
    BuildCircle: new IconType('Build Circle', 'build_circle', 'ef48'),
    Input: new IconType('Input', 'input', 'e890'),
    BookOnline: new IconType('Book Online', 'book_online', 'f217'),
    ZoomOut: new IconType('Zoom Out', 'zoom_out', 'e900'),
    Backup: new IconType('Backup', 'backup', 'e864'),
    PermContactCalendar: new IconType('Perm Contact Calendar', 'perm_contact_calendar', 'e8a3'),
    ViewModule: new IconType('View Module', 'view_module', 'e8f0'),
    OpenWith: new IconType('Open With', 'open_with', 'e89f'),
    SettingsPhone: new IconType('Settings Phone', 'settings_phone', 'e8c5'),
    CircleNotifications: new IconType('Circle Notifications', 'circle_notifications', 'e994'),
    ThreeDRotation: new IconType('3d Rotation', '3d_rotation', 'e84d'),
    ArrowCircleDown: new IconType('Arrow Circle Down', 'arrow_circle_down', 'f181'),
    LabelImportant: new IconType('Label Important', 'label_important', 'e937'),
    CardMembership: new IconType('Card Membership', 'card_membership', 'e8f7'),
    PermPhoneMsg: new IconType('Perm Phone Msg', 'perm_phone_msg', 'e8a8'),
    FilePresent: new IconType('File Present', 'file_present', 'ea0e'),
    Wysiwyg: new IconType('Wysiwyg', 'wysiwyg', 'f1c3'),
    Pageview: new IconType('Pageview', 'pageview', 'e8a0'),
    Swipe: new IconType('Swipe', 'swipe', 'e9ec'),
    IntegrationInstructions: new IconType('Integration Instructions', 'integration_instructions', 'ef54'),
    Upgrade: new IconType('Upgrade', 'upgrade', 'f0fb'),
    TrendingDown: new IconType('Trending Down', 'trending_down', 'e8e3'),
    ChangeHistory: new IconType('Change History', 'change_history', 'e86b'),
    Class: new IconType('Class', 'class', 'e86e'),
    Accessible: new IconType('Accessible', 'accessible', 'e914'),
    SettingsAccessibility: new IconType('Settings Accessibility', 'settings_accessibility', 'f05d'),
    ProductionGuantityLimits: new IconType('Production Quantity Limits', 'production_quantity_limits', 'e1d1'),
    OfflineBolt: new IconType('Offline Bolt', 'offline_bolt', 'e932'),
    Expand: new IconType('Expand', 'expand', 'e94f'),
    ModelTraining: new IconType('Model Training', 'model_training', 'f0cf'),
    DonutLarge: new IconType('Donut Large', 'donut_large', 'e917'),
    AspectRatio: new IconType('Aspect Ratio', 'aspect_ratio', 'e85b'),
    SettingsBackupRestore: new IconType('Settings Backup Restore', 'settings_backup_restore', 'e8ba'),
    CalendarViewMonth: new IconType('Calendar View Month', 'calendar_view_month', 'efe7'),
    Segment: new IconType('Segment', 'segment', 'e94b'),
    ViewColumn: new IconType('View Column', 'view_column', 'e8ec'),
    ScheduleSend: new IconType('Schedule Send', 'schedule_send', 'ea0a'),
    Maximize: new IconType('Maximize', 'maximize', 'e930'),
    BookmarkAdd: new IconType('Bookmark Add', 'bookmark_add', 'e598'),
    Percent: new IconType('Percent', 'percent', 'eb58'),
    ArrowCircleLeft: new IconType('Arrow Circle Left', 'arrow_circle_left', 'eaa7'),
    ArrowDropDown: new IconType('Arrow Drop Down', 'arrow_drop_down', 'e5c5'),
    FileDownload: new IconType('File Download', 'file_download', 'e2c4'),
    ExpandMore: new IconType('Expand More', 'expand_more', 'e5cf'),
    Download: new IconType('Download', 'download', 'f090'),
    KeyboardArrowDown : new IconType('Keyboard Arrow Down', 'keyboard_arrow_down', 'e313'),
    ArrowDownward:new IconType('Arrow Downward', 'arrow_downward', 'e5db'),


    //CustomStyles
    Dashboard1:new IconType('Dashboard', 'dashboard_1', 'd2db'),
    Error:new IconType('Error', 'error', 'd21e'),
    Clock9:new IconType('Clock 9', 'error', 'd26b'),


}