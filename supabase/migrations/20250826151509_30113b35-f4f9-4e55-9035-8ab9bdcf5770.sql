-- Reset domain setup for user@dev.com by clearing their organization's website_url
UPDATE organizations 
SET website_url = NULL, updated_at = now() 
WHERE id = 'b32cc3f1-1ee5-4b6b-ba23-65c9e07dd078';