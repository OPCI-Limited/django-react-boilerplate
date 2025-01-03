from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.db.models import Q
from django.utils import timezone
from .models import Event, Invitee
from .serializers import EventSerializer, InviteeSerializer
from django.utils.timezone import now
from .models import InviteeEventView
from .serializers import InviteeEventViewSerializer
from django.db import transaction
from django.contrib.auth.models import User

class IsEventOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'location']
    permission_classes = [IsAuthenticated, IsEventOwner]

    def perform_create(self, serializer):
        # Save the event and associate it with the currently authenticated user
        event = serializer.save(created_by=self.request.user)

        # Automatically add the creator as an invitee
        Invitee.objects.create(
            event=event,
            user=self.request.user,
            email=self.request.user.email,
            rsvp_status='accepted'  
        )

    @action(detail=False, methods=['get'])
    def upcoming_events(self, request):
        """
        Get all events whose start date is greater than or equal to today and now.
        """
        current_time = now()  # Get the current date and time
        events = Event.objects.filter(start_date__gte=current_time).order_by('start_date')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)


    def get_queryset(self):
        queryset = super().get_queryset()
        created_by = self.request.query_params.get('created_by')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if created_by:
            queryset = queryset.filter(created_by=created_by)
        if start_date and end_date:
            queryset = queryset.filter(start_date__gte=start_date, end_date__lte=end_date)
        
        return queryset

class InviteeViewSet(viewsets.ModelViewSet):
    queryset = Invitee.objects.all()
    serializer_class = InviteeSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def update_rsvp(self, request, pk=None):
        invitee = self.get_object()
        rsvp_status = request.data.get("rsvp_status")

        if rsvp_status not in ["accepted", "declined"]:
            return Response({"error": "Invalid RSVP status."}, status=status.HTTP_400_BAD_REQUEST)

        invitee.rsvp_status = rsvp_status
        invitee.save()
        return Response({"message": "RSVP updated successfully."})

    @action(detail=False, methods=['get'])
    def by_event(self, request):
        """
        Custom action to get all invitees by event ID.
        """
        event_id = request.query_params.get('event_id')

        if not event_id:
            return Response({"error": "Event ID is required"}, status=400)

        try:
            invitees = Invitee.objects.filter(event_id=event_id)
            serializer = self.get_serializer(invitees, many=True)
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=404)
        
    @action(detail=False, methods=['get'], url_path='event-participants/(?P<event_id>[^/.]+)')
    def get_event_participants(self, request, event_id):
        invitees = Invitee.objects.filter(event_id=event_id)
        total_invites = invitees.count()
        accepted_invites = invitees.filter(rsvp_status="yes").count()
        return Response({
            "total_invites": total_invites,
            "accepted_invites": accepted_invites
        })
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        invitees_data = request.data.get('invitees', [])
        if not invitees_data:
            return Response({"error": "No invitees provided"}, status=status.HTTP_400_BAD_REQUEST)

        created_invitees = []
        errors = []

        try:
            with transaction.atomic():
                for invitee_data in invitees_data:
                    event_id = invitee_data.get('event')
                    email = invitee_data.get('email')

                    if not event_id or not email:
                        errors.append({"email": email, "error": "Each invitee must have 'event' and 'email'"})
                        continue

                    # Retrieve the Event object
                    try:
                        event = Event.objects.get(id=event_id)
                    except Event.DoesNotExist:
                        errors.append({"email": email, "error": f"Event with ID {event_id} does not exist"})
                        continue

                    # Retrieve the User object
                    try:
                        user = User.objects.get(email=email)
                    except User.DoesNotExist:
                        errors.append({"email": email, "error": "User with this email does not exist"})
                        continue

                    # Populate invitee fields
                    invitee = Invitee(
                        event=event,
                        email=email,
                        user=user,
                        rsvp_status="pending",  # Default RSVP status
                    )
                    invitee.save()
                    created_invitees.append(invitee)

            serializer = self.get_serializer(created_invitees, many=True)
            return Response(
                {
                    "message": "Invitees created successfully",
                    "data": serializer.data,
                    "errors": errors,
                },
                status=status.HTTP_201_CREATED if not errors else status.HTTP_206_PARTIAL_CONTENT,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



        
class InviteeEventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InviteeEventView.objects.all()
    serializer_class = InviteeEventViewSerializer

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """
        Get all invitee-event records for a specific user ID.
        """
        user_id = request.query_params.get('user_id')

        if not user_id:
            return Response({"error": "user_id query parameter is required."}, status=400)

        # Filter records by user_id
        records = InviteeEventView.objects.filter(user_id=user_id).order_by('-start_date')
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def filter_by_criteria(self, request):
        """
        Filter InviteeEventView by user_id, rsvp_status, and date range.
        """
        user_id = request.query_params.get('user_id')
        rsvp_status = request.query_params.get('rsvp_status')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Validate user_id is provided
        if not user_id:
            return Response({"error": "user_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Build the filter conditions
        filters = Q(user_id=user_id)

        if rsvp_status:
            filters &= Q(rsvp_status=rsvp_status)

        if start_date and end_date:
            filters &= Q(start_date__gte=start_date) & Q(end_date__lte=end_date)

        # Retrieve and serialize the filtered data
        try:
            records = InviteeEventView.objects.filter(filters).order_by('-start_date')
            serializer = self.get_serializer(records, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["get"])
    def filtered_sorted(self, request):
        """
        Filter and sort invitee-event records by user_id and sorting criteria.
        """
        user_id = request.query_params.get("user_id")
        sort_by = request.query_params.get("sort_by", "none")

        if not user_id:
            return Response({"error": "user_id query parameter is required."}, status=400)

        # Filter records by user_id
        queryset = InviteeEventView.objects.filter(user_id=user_id)

        # Apply sorting based on the `sort_by` parameter
        if sort_by == "startDate":
            queryset = queryset.order_by("start_date")
        elif sort_by == "hostName":
            queryset = queryset.order_by("host_name")

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_event(self, request):

        event_id = request.query_params.get('event_id')

        if not event_id:
            return Response({"error": "event_id query parameter is required."}, status=400)

        # Filter records by event_id
        records = InviteeEventView.objects.filter(event_id=event_id).order_by('-start_date')
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)