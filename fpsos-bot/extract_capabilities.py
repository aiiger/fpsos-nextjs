#!/usr/bin/env python3
"""
FPSOS Bot Capability Extractor
Analyzes bot.py and extracts all commands, views, modals, and handlers
"""

import ast
import json
from pathlib import Path
from collections import defaultdict

def extract_capabilities(file_path='bot.py'):
    """Extract all capabilities from bot.py"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tree = ast.parse(content)
    
    capabilities = {
        'commands': [],
        'views': [],
        'modals': [],
        'event_handlers': [],
        'helper_functions': [],
        'constants': [],
        'statistics': {}
    }
    
    # Track classes and functions
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            class_info = {
                'name': node.name,
                'line': node.lineno,
                'methods': []
            }
            
            # Extract methods from class
            for item in node.body:
                if isinstance(item, ast.FunctionDef):
                    class_info['methods'].append({
                        'name': item.name,
                        'line': item.lineno
                    })
            
            # Categorize class
            if 'View' in node.name:
                capabilities['views'].append(class_info)
            elif 'Modal' in node.name:
                capabilities['modals'].append(class_info)
            elif 'Colors' in node.name:
                capabilities['constants'].append(class_info)
        
        elif isinstance(node, ast.FunctionDef):
            func_info = {
                'name': node.name,
                'line': node.lineno,
                'decorator': []
            }
            
            # Extract decorators
            for decorator in node.decorator_list:
                if isinstance(decorator, ast.Name):
                    func_info['decorator'].append(decorator.id)
                elif isinstance(decorator, ast.Attribute):
                    func_info['decorator'].append(decorator.attr)
            
            # Categorize function
            if node.name.startswith('on_'):
                capabilities['event_handlers'].append(func_info)
            elif 'command' in str(func_info['decorator']):
                capabilities['commands'].append(func_info)
            elif node.name.startswith('get_'):
                capabilities['helper_functions'].append(func_info)
    
    # Calculate statistics
    capabilities['statistics'] = {
        'total_lines': len(content.split('\n')),
        'total_commands': len(capabilities['commands']),
        'total_views': len(capabilities['views']),
        'total_modals': len(capabilities['modals']),
        'total_event_handlers': len(capabilities['event_handlers']),
        'total_helper_functions': len(capabilities['helper_functions'])
    }
    
    return capabilities

def print_capabilities(caps):
    """Pretty print capabilities"""
    
    print("═" * 60)
    print("FPSOS BOT CAPABILITIES EXTRACTION")
    print("═" * 60)
    
    # Statistics
    print("\n📊 STATISTICS:")
    print("─" * 60)
    for key, value in caps['statistics'].items():
        label = key.replace('_', ' ').title()
        print(f"  {label:.<40} {value:>5}")
    
    # Commands
    print("\n⚡ SLASH COMMANDS:")
    print("─" * 60)
    for cmd in caps['commands']:
        decorators = ', '.join(cmd['decorator'])
        print(f"  • {cmd['name']:.<30} Line {cmd['line']:>4}  [{decorators}]")
    
    # Event Handlers
    print("\n🎧 EVENT HANDLERS:")
    print("─" * 60)
    for handler in caps['event_handlers']:
        print(f"  • {handler['name']:.<30} Line {handler['line']:>4}")
    
    # Views
    print("\n🎨 INTERACTIVE VIEWS:")
    print("─" * 60)
    for view in caps['views']:
        print(f"  • {view['name']:.<30} Line {view['line']:>4}")
        for method in view['methods']:
            if not method['name'].startswith('_'):
                print(f"      └─ {method['name']:.<25} Line {method['line']:>4}")
    
    # Modals
    print("\n📝 MODAL FORMS:")
    print("─" * 60)
    for modal in caps['modals']:
        print(f"  • {modal['name']:.<30} Line {modal['line']:>4}")
    
    # Helper Functions
    print("\n🛠️  HELPER FUNCTIONS:")
    print("─" * 60)
    for func in caps['helper_functions']:
        print(f"  • {func['name']:.<30} Line {func['line']:>4}")
    
    print("\n" + "═" * 60)

def generate_migration_checklist(caps):
    """Generate checklist for modular migration"""
    
    checklist = []
    
    checklist.append("# Migration Checklist: Monolithic → Modular")
    checklist.append("")
    checklist.append("## Phase 1: Setup Structure")
    checklist.append("- [ ] Create `cogs/` directory")
    checklist.append("- [ ] Create `services/` directory")
    checklist.append("- [ ] Create `database/` directory")
    checklist.append("- [ ] Create `utils/` directory (currently empty)")
    checklist.append("- [ ] Create `config/` directory")
    checklist.append("")
    
    checklist.append("## Phase 2: Migrate Commands")
    for cmd in caps['commands']:
        checklist.append(f"- [ ] Migrate `{cmd['name']}` to `cogs/` (line {cmd['line']})")
    checklist.append("")
    
    checklist.append("## Phase 3: Migrate Event Handlers")
    for handler in caps['event_handlers']:
        checklist.append(f"- [ ] Migrate `{handler['name']}` to `cogs/events.py` (line {handler['line']})")
    checklist.append("")
    
    checklist.append("## Phase 4: Migrate Views & Modals")
    for view in caps['views']:
        checklist.append(f"- [ ] Migrate `{view['name']}` to appropriate cog (line {view['line']})")
    for modal in caps['modals']:
        checklist.append(f"- [ ] Migrate `{modal['name']}` to appropriate cog (line {modal['line']})")
    checklist.append("")
    
    checklist.append("## Phase 5: Extract Helper Functions")
    for func in caps['helper_functions']:
        checklist.append(f"- [ ] Move `{func['name']}` to `utils/embeds.py` (line {func['line']})")
    checklist.append("")
    
    checklist.append("## Phase 6: Refactor bot.py")
    checklist.append("- [ ] Remove all migrated code")
    checklist.append("- [ ] Keep only bot initialization and cog loading")
    checklist.append("- [ ] Test that all commands still work")
    
    return '\n'.join(checklist)

def save_to_json(caps, filename='bot_capabilities.json'):
    """Save capabilities to JSON for programmatic access"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(caps, f, indent=2)
    print(f"\n💾 Saved capabilities to {filename}")

if __name__ == '__main__':
    # Extract capabilities
    caps = extract_capabilities()
    
    # Print to console
    print_capabilities(caps)
    
    # Save to JSON
    save_to_json(caps)
    
    # Generate migration checklist
    checklist = generate_migration_checklist(caps)
    with open('MIGRATION_CHECKLIST.md', 'w', encoding='utf-8') as f:
        f.write(checklist)
    print(f"📋 Generated migration checklist: MIGRATION_CHECKLIST.md")
    
    # Recommendations
    print("\n💡 RECOMMENDATIONS:")
    print("─" * 60)
    
    if caps['statistics']['total_lines'] > 200:
        print("  ⚠️  Your bot.py has 200+ lines - consider modular structure")
    
    if len(caps['views']) > 3:
        print(f"  ⚠️  {len(caps['views'])} views detected - extract to separate files")
    
    if len(caps['commands']) > 3:
        print(f"  ⚠️  {len(caps['commands'])} commands - use cogs for better organization")
    
    print("\n✅ Next Steps:")
    print("  1. Review MIGRATION_CHECKLIST.md")
    print("  2. Create modular structure (cogs/, services/, database/)")
    print("  3. Migrate one module at a time")
    print("  4. Test after each migration")
    print("\n" + "═" * 60)
