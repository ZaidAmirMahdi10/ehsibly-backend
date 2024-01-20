# Invoice-Management


npx prisma migrate dev --name update_invoice_schema --create-only
npx prisma migrate dev
npx prisma generate
 

# Netlify For normal build
command = "yarn install && yarn prisma:generate && yarn migrate"


# Netlify For restting database
command = "yarn install && yarn prisma migrate reset --force && yarn prisma:generate"
