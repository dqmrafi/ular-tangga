# GLOBAL HUD REDESIGN — EXISTING GAME HTML IMPLEMENTATION

Perform a complete HUD redesign and layout implementation directly inside my existing 3D game project.

This is an actual HTML/CSS/JavaScript modification task, NOT an image-generation task or a standalone mockup.

## 1. PROJECT LOCATION

**Main project directory:**
`X:\rohmanapp\ular_tangga_3d_ui_modular_v2`

**HUD reference images directory:**
`X:\rohmanapp\ular_tangga_3d_ui_modular_v2\game\redesign-hud`

First, inspect the reference folder and identify both provided HUD reference images.

Do not move, rename, or delete the reference images.

## 2. REFERENCE IMAGE INSTRUCTIONS

Use both reference images with different responsibilities.

**REFERENCE 1 — LAYOUT REFERENCE**

Use this image as the primary guide for:
- Overall HUD layout.
- Element positioning.
- Button arrangement.
- Component dimensions and proportions.
- Spacing and margins.
- Visual hierarchy.

**REFERENCE 2 — VISUAL STYLE REFERENCE**

Use this image as the primary guide for:
- Minecraft pixel-style appearance.
- Thick black outlines.
- Square beveled panels.
- Royal blue buttons.
- Emerald green main Play button.
- Golden orange Shop button.
- Purple Rewards button.
- Pixel-art icons.
- Bold white typography.
- Shadows, borders, and dimensional effects.

Combine both references into one consistent global HUD design.

## 3. TARGET HUD LAYOUT

Reorganize the existing HUD according to REFERENCE 1.

**TOP LEFT**
- Player profile and avatar.
- Username.
- Level indicator.
- XP progress bar.

**TOP RIGHT**
- Gem counter.
- Coin counter.

**LEFT SIDE NAVIGATION**

First row:
- Inventory.
- Leaderboard.

Second row:
- Mission.

Third row:
- Event.

Arrange them vertically with consistent spacing and alignment.

**RIGHT SIDE**

Above the main action:
- Mail.
- Settings / Gear.

Place these two buttons side by side.

Bottom-right:
- Large main Play / MULAI button.
- Make this the most prominent action on the screen.

**BOTTOM LEFT**

Arrange these three existing buttons horizontally:
- Shop.
- Friends.
- Rewards.

Shop should be slightly larger than Friends and Rewards.

## 4. GLOBAL VISUAL DESIGN

Implement the Minecraft Bedrock-inspired pixel aesthetic from REFERENCE 2.

**Color palette:**
- Royal blue for primary panels.
- Dark navy and black for outlines.
- Emerald green for the main Play button.
- Golden orange for Shop.
- Purple for Rewards.
- White for typography.
- Gold and green for resource indicators.

**Shapes and styling:**
- Thick dark pixel-style borders.
- Square and slightly beveled rectangular buttons.
- Consistent border thickness.
- Subtle dimensional shadows.
- Simple gradients.
- Pixel-inspired icons.
- Bold, highly readable game typography.

Maintain the same visual language across all HUD elements.

## 5. INSPECT EXISTING PROJECT BEFORE EDITING

Before implementing anything:

1. Inspect the project folder structure.
2. Identify the actual HTML entry point.
3. Inspect the existing HUD implementation.
4. Identify associated CSS and JavaScript files.
5. Locate existing button elements, icons, and image assets.
6. Identify existing event handlers and game functionality.
7. Determine how the HUD interacts with the 3D game scene.

Do not blindly replace existing code.

Understand the existing architecture before making changes.

## 6. STRICT BUTTON PRESERVATION

The original game determines which buttons and functions exist.

The reference images determine how those buttons should look and where they should be positioned.

STRICTLY FOLLOW THESE RULES:

- Do not add new buttons.
- Do not remove existing buttons.
- Do not duplicate buttons.
- Do not invent new functionality.
- Preserve all original button labels where they already exist.
- Preserve all existing interactions.
- Preserve notification badges and their behavior.
- Preserve player information and resource values.
- Preserve all existing JavaScript event handlers.

You may change the appearance, size, styling, and position of existing HUD elements.

Do not create additional controls just because they appear in a reference image.

## 7. PRESERVE THE ORIGINAL GAME

The following must remain completely unchanged:

- Original background.
- Original sky and clouds.
- Original terrain and environment.
- Central 3D player character.
- Character models and animations.
- Camera positioning.
- Three.js or WebGL rendering.
- Canvas elements.
- Gameplay systems.
- Game mechanics and controls.

Only modify the HUD and its related layout implementation.

Do not interfere with the existing 3D scene.

## 8. HTML/CSS IMPLEMENTATION

Implement the design directly into the existing project.

Use:
- CSS Grid and Flexbox.
- Responsive positioning.
- CSS borders and box shadows.
- Simple gradients.
- Existing icon assets.
- Reusable styling where appropriate.
- Lightweight HTML/CSS components.

Avoid:
- Replacing HUD elements with a static screenshot.
- Unnecessary image backgrounds.
- Expensive CSS filters.
- Complex textures.
- Excessive animations.
- Unnecessary JavaScript.
- Additional rendering engines.

Prioritize lightweight performance.

## 9. RESPONSIVE DESIGN

Make the HUD adapt to the actual game viewport.

Requirements:
- Maintain the reference layout proportions.
- Prevent overlapping buttons.
- Prevent clipping beyond screen boundaries.
- Maintain consistent spacing.
- Keep the central character visible.
- Preserve proper alignment.
- Avoid excessive empty spaces.
- Support different screen sizes without breaking the layout.

## 10. IMPLEMENTATION SAFETY

- Modify only the necessary files.
- Preserve existing project architecture.
- Do not delete unrelated code.
- Do not rewrite the entire game.
- Avoid breaking existing asset paths.
- Preserve existing game integrations.
- Keep code maintainable.

If the existing implementation uses modular HTML/CSS/JS files, follow its existing modular structure.

## 11. FINAL VALIDATION

After completing the redesign:

1. Open the modified game in the browser.
2. Verify all HUD elements are visible.
3. Verify all original buttons are still present exactly once.
4. Test all existing button interactions.
5. Check the layout against both reference images.
6. Check spacing, dimensions, and alignment.
7. Check responsive behavior.
8. Confirm the original 3D character and background are unchanged.
9. Fix any visual overlap, clipping, or broken functionality.
10. Confirm that the game still runs correctly.

Do not stop after editing the code. Perform visual and functional verification.

## FINAL OBJECTIVE

Transform the existing game into a polished Minecraft Bedrock-inspired interface.

REFERENCE 1 = LAYOUT AND POSITIONING.

REFERENCE 2 = VISUAL DESIGN AND STYLING.

EXISTING GAME PROJECT = ORIGINAL CONTENT, ASSETS, FUNCTIONALITY, AND GAME ENGINE.

The final result must look like a cohesive Minecraft-inspired game HUD while preserving the original game world and all existing functionality.

**IMPLEMENT DIRECTLY INTO THE EXISTING PROJECT. DO NOT CREATE A SEPARATE DEMO OR REPLACEMENT GAME.**