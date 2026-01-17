# Migration Checklist: Monolithic → Modular

## Phase 1: Setup Structure
- [ ] Create `cogs/` directory
- [ ] Create `services/` directory
- [ ] Create `database/` directory
- [ ] Create `utils/` directory (currently empty)
- [ ] Create `config/` directory

## Phase 2: Migrate Commands

## Phase 3: Migrate Event Handlers

## Phase 4: Migrate Views & Modals
- [ ] Migrate `PreBookingView` to appropriate cog (line 113)
- [ ] Migrate `WelcomeView` to appropriate cog (line 130)
- [ ] Migrate `DiagnosticView` to appropriate cog (line 152)
- [ ] Migrate `BookingView` to appropriate cog (line 176)
- [ ] Migrate `QuickAssessmentModal` to appropriate cog (line 166)

## Phase 5: Extract Helper Functions
- [ ] Move `get_welcome_embed` to `utils/embeds.py` (line 188)
- [ ] Move `get_packages_embed` to `utils/embeds.py` (line 192)

## Phase 6: Refactor bot.py
- [ ] Remove all migrated code
- [ ] Keep only bot initialization and cog loading
- [ ] Test that all commands still work