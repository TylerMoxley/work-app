from django.urls import path
from .views import get_ticket_and_thread, post_comment_to_ticket

urlpatterns = [
    path('ticket/<int:ticket_id>/', get_ticket_and_thread, name='get_ticket_and_thread'),
    path('ticket/<int:ticket_id>/comment/', post_comment_to_ticket, name='post_comment_to_ticket'),
]
