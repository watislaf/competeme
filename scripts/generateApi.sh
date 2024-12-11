API="app/api"
SPEC_FILE="app/api/api.json"
rm -f "$SPEC_FILE"

if wget http://localhost:8080/api/spec -O "$SPEC_FILE"; then
  cd "$ADMIN_PANEL" || exit
  npx openapi-generator-cli generate \
    -g typescript-axios \
    -i "$SPEC_FILE" \
    -c "$API/.openapi-generator-configuration.json" \
    -o "$API" \
    --api-package apis \
    --model-package models \
    --type-mappings json="string,number" \
    --language-specific-primitives "string,number"
  cd || exit
  rm -f "$SPEC_FILE"
else
 echo run server first
fi
