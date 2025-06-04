# FlashPay + TekeTeke

Instructions and project overview.

## Active bill cleanup

The server keeps pending bills in memory. To prevent old entries from
building up, a cleanup task runs every minute and removes any bill whose
`createdAt` timestamp is older than a configurable TTL. Both the main
server and POS listener use this cleanup.

Set the TTL in milliseconds with the `ACTIVE_BILL_TTL` environment
variable (defaults to five minutes).
