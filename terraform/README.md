## Initialize
```bash
terraform init
# az ad sp create-for-rbac --name sp-fullswing-contributer --role="Contributor" --scopes="subscriptions/ca62117d-82a8-4604-be26-46e1c3025e8b"
# terraform import azurerm_resource_group.rg subscriptions/ca62117d-82a8-4604-be26-46e1c3025e8b/resourceGroups/rg-fullswing
#terraform login #using Terraform Cloud
```

## Deploy
```bash
terraform apply -auto-approve
```

## Destroy
```bash
terraform destroy
```
