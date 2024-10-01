import requests
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# working base code for posting an internal note to a ticket

@csrf_exempt  # Disable CSRF protection for this view (not recommended in production)
def post_comment_to_ticket(request, ticket_id):
    if request.method == 'POST':
        # Construct the API URL for adding a comment to the ticket
        zendesk_url = f'https://{settings.ZENDESK_SUBDOMAIN}/api/v2/tickets/{ticket_id}.json'
        
        # Get the comment body from the request (or use a default for testing)
        comment_body = request.POST.get('comment', 'This is a test internal note.')
        
        # Prepare the data to send to Zendesk (wrapped in a "ticket" object)
        payload = {
            "ticket": {
                "comment": {
                    "body": comment_body,
                    "public": False  # Set to False to make this an internal note
                }
            }
        }

        # Authentication
        auth = (f'{settings.ZENDESK_EMAIL}/token', settings.ZENDESK_API_TOKEN)

        # Set the headers for JSON content
        headers = {'Content-Type': 'application/json'}

        try:
            # Send the POST request to Zendesk
            response = requests.put(zendesk_url, headers=headers, auth=auth, data=json.dumps(payload))

            if response.status_code == 200:
                # Success, return the response from Zendesk
                return JsonResponse(response.json(), safe=False)
            else:
                # Handle error responses from Zendesk
                return JsonResponse({
                    'error': 'Failed to post internal note to ticket',
                    'status_code': response.status_code,
                    'message': response.text,
                }, status=response.status_code)

        except requests.exceptions.RequestException as e:
            # Handle any exceptions related to the request
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method. Use POST.'}, status=400)



# working base code for posting a public comment to a ticket

# @csrf_exempt  # Disable CSRF protection for this view
# def post_comment_to_ticket(request, ticket_id):
#     if request.method == 'POST':
#         # Construct the API URL for adding a comment to the ticket
#         zendesk_url = f'https://{settings.ZENDESK_SUBDOMAIN}/api/v2/tickets/{ticket_id}.json'
        
#         # Get the comment body from the request (or use a default for testing)
#         comment_body = request.POST.get('comment', 'This is a test message.')
        
#         # Prepare the data to send to Zendesk (wrapped in a "ticket" object)
#         payload = {
#             "ticket": {
#                 "comment": {
#                     "body": comment_body,
#                     "public": True  # Set to True if this is a public comment
#                 }
#             }
#         }

#         # Authentication
#         auth = (f'{settings.ZENDESK_EMAIL}/token', settings.ZENDESK_API_TOKEN)

#         # Set the headers for JSON content
#         headers = {'Content-Type': 'application/json'}

#         try:
#             # Send the POST request to Zendesk
#             response = requests.put(zendesk_url, headers=headers, auth=auth, data=json.dumps(payload))

#             if response.status_code == 200:
#                 # Success, return the response from Zendesk
#                 return JsonResponse(response.json(), safe=False)
#             else:
#                 # Handle error responses from Zendesk
#                 return JsonResponse({
#                     'error': 'Failed to post comment to ticket',
#                     'status_code': response.status_code,
#                     'message': response.text,
#                 }, status=response.status_code)

#         except requests.exceptions.RequestException as e:
#             # Handle any exceptions related to the request
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request method. Use POST.'}, status=400)

def get_ticket_and_thread(request, ticket_id):
    # Construct the URL for the ticket comments endpoint
    zendesk_url = f"https://{settings.ZENDESK_SUBDOMAIN}/api/v2/tickets/{ticket_id}/comments.json"

    # Set the authorization details
    auth = (f"{settings.ZENDESK_EMAIL}/token", settings.ZENDESK_API_TOKEN)

    try:
        # Send the GET request to the Zendesk API
        response = requests.get(zendesk_url, auth=auth)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response
            ticket_data = response.json()
            return JsonResponse(ticket_data)
        else:
            # Handle errors by returning the status code and message
            return JsonResponse({'error': 'Unable to fetch ticket thread', 'status_code': response.status_code}, status=response.status_code)
    except Exception as e:
        # Handle any unexpected exceptions
        return JsonResponse({'error': str(e)}, status=500)
