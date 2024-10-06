from rest_framework import viewsets
from .models import RepairBill
from .serializers import RepairBillSerializer
import xmltodict
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import hmac
import hashlib
import json


class RepairBillViewSet(viewsets.ModelViewSet):
    queryset = RepairBill.objects.all()
    serializer_class = RepairBillSerializer

    def get_queryset(self):
        status = self.request.query_params.get('status', None)
        if status:
            return self.queryset.filter(status=status)
        return self.queryset
    


@csrf_exempt
def docusign_webhook(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print('Webhook received:', json.dumps(data, indent=2))
        except json.JSONDecodeError:
            print('Invalid JSON received')
            return HttpResponse('Invalid JSON', status=400)

        # Extract envelope_id and event_type
        envelope_id = data.get('data', {}).get('envelopeId')
        event_type = data.get('event', '').lower()

        print(f'Envelope ID: {envelope_id}, Event Type: {event_type}')

        # Check if the event indicates the envelope has been signed
        if event_type in ['recipient-completed', 'envelope-completed']:
            # Update the corresponding RepairBill to status 'signed'
            updated_count = RepairBill.objects.filter(envelope_id=envelope_id).update(status='signed')
            if updated_count > 0:
                print(f'RepairBill with envelope ID {envelope_id} updated to status "signed"')
            else:
                print(f'No RepairBill found with envelope ID {envelope_id}')
        else:
            print(f'Envelope {envelope_id} event type is {event_type}, not indicating completion')

        return HttpResponse(status=200)
    else:
        return HttpResponse(status=405)