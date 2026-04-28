import httpx
from app.config import settings


async def send_telegram_notification(message: str, chat_id: str = None):
    """Send a notification via Telegram Bot API."""
    token = settings.TELEGRAM_BOT_TOKEN
    target_chat = chat_id or settings.TELEGRAM_CHAT_ID

    if not token or not target_chat:
        return {"status": "skipped", "reason": "Telegram not configured"}

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": target_chat,
        "text": message,
        "parse_mode": "HTML",
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            return {"status": "sent", "response": response.status_code}
    except Exception as e:
        return {"status": "error", "reason": str(e)}


async def notify_delay(activity_name: str, planned_pct: float, actual_pct: float):
    """Notify about schedule delay."""
    msg = (
        f"⚠️ <b>Retard Détecté</b>\n\n"
        f"📋 Activité: <b>{activity_name}</b>\n"
        f"📊 Planifié: {planned_pct}%\n"
        f"📉 Réel: {actual_pct}%\n"
        f"🔻 Écart: {round(planned_pct - actual_pct, 1)}%"
    )
    return await send_telegram_notification(msg)


async def notify_critical_risk(risk_desc: str, score: float):
    """Notify about critical risk."""
    msg = (
        f"🚨 <b>Risque Critique</b>\n\n"
        f"📝 {risk_desc}\n"
        f"⚡ Score: {score}/20"
    )
    return await send_telegram_notification(msg)


async def notify_ncr(ncr_number: str, description: str, severity: str):
    """Notify about new NCR."""
    emoji = {"minor": "🟡", "major": "🟠", "critical": "🔴"}.get(severity, "⚪")
    msg = (
        f"{emoji} <b>Nouvelle Non-Conformité</b>\n\n"
        f"📋 NCR: <b>{ncr_number}</b>\n"
        f"📝 {description}\n"
        f"⚠️ Sévérité: {severity.upper()}"
    )
    return await send_telegram_notification(msg)
