# UI Design Review

## Pre-Build Review

- User job: let visitors feel the birthday momentum without competing with the invitation, RSVP, or closing signature.
- The countdown should read as a quiet supporting detail, not a primary hero card.
- The signature remains the emotional endpoint, so the countdown needs to live beneath it with lighter contrast and less chrome.
- Motion should reinforce arrival and liveliness without creating a second focal point.

## Risks To Address Before Coding

- Leaving the countdown in a bordered card would keep too much visual weight in the hero.
- Moving the countdown below the signature without reducing contrast could still pull focus away from the closing message.
- A full translate/scale animation on every tick would feel noisy; reduced-motion should fall back to opacity-only behavior.
- Small screens need a compact horizontal rhythm so the countdown does not feel like a second section.

## Post-Build Screenshot Review

- Verified on the local `/birthday` page after implementation.
- The signature card remains the primary focal point and the countdown now sits beneath it instead of competing in the hero.
- The countdown reads as supporting information through smaller pill groups, lighter shadows, and lower-contrast copy.
- The inline number transitions add motion without introducing another large animated container.

## Remaining Polish Or UX Issues

- None from the local screenshot review.
