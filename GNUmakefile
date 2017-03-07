MANIFEST_FILE := asocial/manifest.json
DIST_DIR := dist

.PHONY: dist
dist::
	@npm run build
	@rm -Rf $(DIST_DIR)
	@mkdir -p $(DIST_DIR)/asocial
	@rsync -r --verbose --exclude 'asocial/src' ./asocial $(DIST_DIR)

### Выпуск новой версии
ifeq (version,$(firstword $(MAKECMDGOALS)))
NEW_VERSION := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(NEW_VERSION):;@:)
endif

.PHONY: version
version::
	@current_version=$$(npm version $(NEW_VERSION)); \
		current_version=$${current_version:1:100}; \
		echo "New version: $${current_version}"; \
		sed -e "s/\"version\": \"[0-9.]*\"/\"version\": \"$${current_version}\"/" -i "" $(MANIFEST_FILE); \
		git add $(MANIFEST_FILE); \
		git commit --amend --no-edit; \
		git tag --force "v$${current_version}" HEAD
