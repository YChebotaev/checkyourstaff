/// <reference types="vite/client" />

type WebAppUser = {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

type WebAppChat = {
  id: string
  type: 'group' | 'supergroup' | 'channel'
  title: string
  username?: string
  photo_url?: string
}

type WebAppInitData = {
  query_id?: string
  user?: WebAppUser
  receiver?: WebAppUser
  chat?: WebAppChat
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date: number
  hash: string
}

type ThemeParams = {
  bg_color: string
  text_color: string
  hint_color: string
  link_color: string
  button_color: string
  button_text_color: string
  secondary_bg_color: string
}

type BackButton = {
  isVisible: boolean
  show(): void
  hide(): void
  onClick(callback: () => void): void
  offClick(callback: () => void): void
}

type MainButton = {
  text: string
  color: string
  textColor: string
  isVisible: boolean
  isActive: boolean
  readonly isProgressVisible: boolean
  setText(text: string): void
  show(): void
  hide(): void
  enable(): void
  disable(): void
  showProgress(leaveActive: boolean): void
  hideProgress(): void
  setParams(params: {
    text?: string
    color?: string
    text_color?: string
    is_visible?: boolean
    is_active?: boolean
  }): void
  onClick(callback: () => void): void
  offClick(callback: () => void): void
}

type HapticFeedback = {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
  notificationOccurred(type: 'error' | 'success' | 'warning'): void
  selectionChanged(): void
}

type CloudStorage = {
  setItem(key: string, value: string, callback?: (error: null | Error, success: boolean) => void): void
  getItem(key: string, callback?: (error: null | Error, value: string) => void): void
  getItems(keys: string[], callback?: (error: null | Error, values: string[]) => void): void
  removeItem(key: string, callback?: (error: null | Error, success: boolean) => void): void
  removeItems(keys: string[], callback?: (error: null | Error, success: boolean) => void): void
  getKeys(callback: (error: null | Error, values: string[]) => void): void
}

type PopupButton = {
  id?: string
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
  text?: string
}

type PopupParams = {
  title?: string
  message: string
  buttons: PopupButton[]
}

type ScanQrPopupParams = {
  text?: string
}

declare const Telegram: {
  WebApp: {
    initData: string
    initDataUnsafe: WebAppInitData
    version: string
    platform: string
    colorScheme: string
    themeParams: ThemeParams
    isExpanded: boolean
    viewportHeight: number
    viewportStableHeight: number
    headerColor: string
    backgroundColor: string
    isClosingConfirmationEnabled: boolean
    MainButton: MainButton
    BackButton: BackButton
    HapticFeedback: HapticFeedback
    CloudStorage: CloudStorage
    isVersionAtLeast(version: string): boolean
    setHeaderColor(color: string): void
    setBackgroundColor(color: string): void
    enableClosingConfirmation(): void
    disableClosingConfirmation(): void
    onEvent(
      eventType:
        | 'themeChanged'
        | 'viewportChanged'
        | 'mainButtonClicked'
        | 'backButtonClicked'
        | 'settingsButtonClicked'
        | 'invoiceClosed'
        | 'popupClosed'
        | 'qrTextReceived'
        | 'clipboardTextReceived'
        | 'writeAccessRequested'
        | 'contactRequested',
      eventHandler: () => void
    ): void
    offEvent(
      eventType:
        | 'themeChanged'
        | 'viewportChanged'
        | 'mainButtonClicked'
        | 'backButtonClicked'
        | 'settingsButtonClicked'
        | 'invoiceClosed'
        | 'popupClosed'
        | 'qrTextReceived'
        | 'clipboardTextReceived'
        | 'writeAccessRequested'
        | 'contactRequested',
      eventHandler: () => void
    ): void
    sendData(data: string): void
    switchInlineQuery(query: string, choose_chat_types: 'users' | 'bots' | 'groups' | 'channels'): void
    openLink(url: string, options?: { try_instant_view: boolean }): void
    openTelegramLink(url: string): void
    openInvoice(url: string, callback?: (invoiceStatus: string) => void): void
    showPopup(params: PopupParams, callback?: (buttonId: string) => void): void
    showAlert(message: string, callback?: () => void): void
    showConfirm(message: string, callback?: (isOk: boolean) => void): void
    showScanQrPopup(params: ScanQrPopupParams, callback?: (text: string) => void | boolean): void
    closeScanQrPopup(): void
    readTextFromClipboard(callback?: (text: string) => void): void
    requestWriteAccess(callback?: (accessGranted: boolean) => void): void
    requestContact(callback?: (shared: boolean) => void): void
    ready(): void
    expand(): void
    close(): void
  }
}
