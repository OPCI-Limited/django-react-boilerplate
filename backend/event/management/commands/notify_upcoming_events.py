from django.core.management.base import BaseCommand
from django.utils.timezone import now, timedelta
from event.models import Event
from event.models import Notification

class Command(BaseCommand):
    help = "Notify users about upcoming events within 24 hours"

    def handle(self, *args, **options):
        # Logic to find upcoming events
        upcoming_threshold = now() + timedelta(hours=24)
        events = Event.objects.filter(start_date__lte=upcoming_threshold, start_date__gte=now())

        for event in events:
            # Send notification (replace with your implementation)
            Notification.objects.create(
                user=event.created_by,
                message=f"Reminder: Your event '{event.title}' is starting soon!",
                event=event
            )

        self.stdout.write(self.style.SUCCESS(f"{len(events)} notifications sent for upcoming events."))