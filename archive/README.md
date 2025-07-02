# Archive Folder

This folder contains legacy files, deprecated documentation, and test files that are no longer actively used in the project but are preserved for reference.

## 📁 Contents

### `snipcart-files/`
**Deprecated Snipcart Integration Files**

These files contain documentation and setup instructions for the old Snipcart e-commerce integration that has been replaced by Medusa.js.

- `SNIPCART_SETUP.md` - Original Snipcart setup guide
- `SNIPCART_WEBHOOK_SETUP.md` - Snipcart webhook configuration

**Status**: ❌ Deprecated - Replaced by Medusa.js integration

### `test-files/`
**Development and Testing Files**

Various test scripts and sample files used during development and testing phases.

- `test-*.js` - Various testing scripts for different features
- `generate-sample-email.js` - Email template generation test
- `sample-email.*` - Sample email output files

**Status**: 🔧 Development artifacts - Kept for reference

### `legacy-files/`
**Legacy Project Files**

Old project files from previous iterations and migration phases.

- `CURRENCY_IMPLEMENTATION_SUMMARY.md` - Old currency implementation docs
- `EUR_MIGRATION_SUMMARY.md` - EUR currency migration notes
- `setup-environment.js` - Old environment setup script
- `validate-environment.js` - Old validation script
- `verify-webhook-setup.js` - Old webhook verification
- `shinshop/` - Old duplicate project folder

**Status**: 📦 Legacy - Superseded by current implementation

## 🚫 Important Notes

### Do Not Use These Files
- These files are **not part of the current project**
- They may contain **outdated information**
- Using them could **break the current setup**

### Why Keep Them?
- **Reference**: Useful for understanding project evolution
- **Rollback**: In case we need to reference old implementations
- **Documentation**: Shows what was tried and why it was changed

## 🔄 Migration Status

### Completed Migrations
- ✅ **Snipcart → Medusa.js**: Complete e-commerce platform migration
- ✅ **Manual Setup → Automated Scripts**: Streamlined setup process
- ✅ **Scattered Docs → Organized Structure**: Better documentation organization

### Current Active Files
For current project files, see:
- **Main Project**: `../README.md`
- **Project Structure**: `../docs/PROJECT_STRUCTURE.md`
- **Setup Guides**: `../docs/setup/`

## 🗑️ Cleanup Policy

### When to Archive
Files are moved here when they are:
- No longer used in the current implementation
- Replaced by better alternatives
- Outdated but potentially useful for reference

### When to Delete
Files may be permanently deleted if they are:
- Completely irrelevant to the project
- Contain sensitive information that shouldn't be preserved
- Taking up significant space with no reference value

## 📚 Historical Context

### Project Evolution
1. **Phase 1**: Initial Gatsby + Snipcart implementation
2. **Phase 2**: Currency and internationalization additions
3. **Phase 3**: Email notification system
4. **Phase 4**: Migration to Medusa.js (current)

### Key Changes
- **E-commerce Platform**: Snipcart → Medusa.js
- **Payment Processing**: Stripe → Mollie
- **Backend Architecture**: Serverless → Full backend
- **Documentation**: Scattered → Organized

---

**Note**: If you're looking for current project documentation, please refer to the main project README and the docs folder in the project root.
