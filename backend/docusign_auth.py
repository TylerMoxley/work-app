# docusign_auth.py

import os
from docusign_esign import ApiClient
from docusign_esign.client.api_exception import ApiException

def get_api_client():
    # Set your DocuSign credentials
    integrator_key = 'abd0a6d2-3347-4337-a863-df200601b0d2'  # Also known as client_id
    user_id = '73bfde59-12ce-445d-b982-b708ad015626'  # Your DocuSign user ID (GUID)
    account_id = '5aec9a96-0ee4-4aa8-865b-5095261be266'  # Your DocuSign account ID
    oauth_base_url = 'account-d.docusign.com'  # Demo environment
    private_key_file = 'path/to/docusign_private_key.txt'  # Ensure the path is correct

    # Read the private key from a file
    with open(private_key_file, 'rb') as key_file:
        private_key_bytes = key_file.read()

    # Create an ApiClient instance
    api_client = ApiClient()
    api_client.host = 'https://demo.docusign.net/restapi'
    api_client.set_oauth_base_path(oauth_base_url)

    # Define the scopes
    scopes = ['signature', 'impersonation']

    try:
        # Obtain the JWT access token
        token_response = api_client.request_jwt_user_token(
            client_id=integrator_key,
            user_id=user_id,
            oauth_host_name=oauth_base_url,
            private_key_bytes=private_key_bytes,
            expires_in=3600,
            scopes=scopes
        )

        access_token = token_response.access_token
        api_client.set_default_header('Authorization', f'Bearer {access_token}')
        return api_client, account_id

    except ApiException as e:
        print(f"Exception when obtaining access token: {e}")
        return None, None
