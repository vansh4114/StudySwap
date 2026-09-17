\---

name: studyswap-ui

description: Designs and improves the StudySwap React frontend with a premium dark cinematic education-tech visual system inspired by modern product websites. Use when creating, redesigning, polishing, or reviewing StudySwap UI/UX, responsive layouts, components, pages, animations, typography, colors, navigation, cards, forms, dashboards, or mobile experiences.

\---



\# StudySwap UI Design Skill



\## 1. Purpose



This skill defines the visual and UX direction for the StudySwap frontend.



StudySwap is a student platform for discovering, sharing, rating, bookmarking, and downloading academic resources.



The goal is to transform the existing UI from a generic SaaS/college-project appearance into a:



\- premium

\- modern

\- cinematic

\- dark

\- bold

\- editorial

\- education-focused

\- technology-oriented



interface.



The interface should feel like a polished startup/product rather than a typical student CRUD application.



\---



\# 2. CRITICAL PROJECT CONSTRAINTS



StudySwap already has working backend functionality.



UI work MUST NOT unnecessarily modify or break:



\- Express backend

\- MongoDB/Mongoose models

\- authentication

\- JWT handling

\- authorization

\- Cloudinary

\- Multer

\- resource APIs

\- admin APIs

\- contribution points

\- ratings

\- bookmarks

\- reports

\- downloads

\- upload behavior

\- API contracts



The frontend must continue using the existing API architecture.



Do not rewrite backend code simply to make a UI change.



Do not replace working functionality with mock data.



Do not remove existing functionality because of a redesign.



If an API change is genuinely necessary, explain why before making it.



\---



\# 3. EXISTING TECHNOLOGY



Frontend:



\- React

\- Vite

\- JavaScript

\- Tailwind CSS

\- React Router

\- Lucide icons



Backend:



\- Node.js

\- Express.js

\- MongoDB

\- Mongoose



Authentication:



\- JWT

\- bcrypt



File storage:



\- Cloudinary



The frontend should remain compatible with this architecture.



\---



\# 4. CORE VISUAL DIRECTION



The visual direction is inspired by the visual language of premium modern technology/product websites.



The provided visual references emphasize:



\- very dark backgrounds

\- large bold typography

\- high contrast

\- bright lime/yellow-green accent colors

\- pill-shaped navigation

\- thin subtle borders

\- large hero sections

\- strong visual hierarchy

\- restrained use of gradients

\- immersive imagery

\- generous whitespace

\- clean layouts

\- subtle motion



Do NOT copy any reference website directly.



Do NOT copy:



\- logos

\- text

\- branding

\- proprietary images

\- exact layouts

\- source code

\- distinctive illustrations



Instead, create an original StudySwap identity using the same broad design principles.



\---



\# 5. COLOR SYSTEM



Primary background:



\#050708



Secondary background:



\#0A0D0F



Elevated surface:



\#101416



Secondary surface:



\#151A1D



Primary text:



\#F5F5F5



Secondary text:



\#A5A8AA



Muted text:



\#72777A



Primary accent:



\#DFFF00



Alternative accent:



\#CFFF00



Border:



rgba(255,255,255,0.10)



Strong border:



rgba(255,255,255,0.16)



Error:



\#FF5C5C



Success:



\#B8FF4D



WARNING:



Do not use the old purple-heavy StudySwap visual identity as the primary visual language.



The new visual identity should be predominantly:



dark + white + lime.



Accent colors should be used intentionally rather than everywhere.



\---



\# 6. TYPOGRAPHY



Typography must create a strong visual hierarchy.



Headlines:



\- large

\- bold

\- compact

\- confident

\- high contrast



Use large display typography for hero sections.



Example visual hierarchy:



Eyebrow:

small uppercase / medium weight



Hero heading:

very large / bold



Supporting text:

smaller / muted gray



CTA:

medium/bold



Body:

comfortable readable size



Avoid:



\- excessive font sizes everywhere

\- overly decorative fonts

\- poor line-height

\- too many font families



Prefer one strong primary font family with multiple weights.



\---



\# 7. HERO DESIGN



The StudySwap homepage should feel visually impressive immediately.



Possible structure:



Navbar



Hero eyebrow



Large headline



Supporting statement



Primary CTA



Secondary CTA



Visual/resource showcase



Statistics or social proof



Example messaging style:



"YOUR KNOWLEDGE.

SHARED."



or



"Find the notes

you actually need."



or



"Study smarter.

Share what you know."



Do not blindly use these exact phrases if better StudySwap-specific copy exists.



Hero headings should be short and memorable.



Avoid generic SaaS phrases such as:



"Welcome to our platform"



"Your all-in-one solution"



"Revolutionizing education"



\---



\# 8. NAVBAR



The navbar should be:



\- dark

\- compact

\- slightly translucent when appropriate

\- bordered

\- rounded/pill-shaped or softly rounded

\- visually separated from the page background



Desktop structure can include:



StudySwap logo



Browse



Upload



Bookmarks



Profile



Admin (only for admins)



Login/Register when logged out



The primary action should use the lime accent.



Example:



\[ StudySwap ]   Browse   Upload   Bookmarks   Profile   \[Upload Notes]



Do not overcrowd the navbar.



On mobile:



\- collapse navigation

\- provide a clean menu

\- keep the primary action accessible

\- avoid horizontal overflow



\---



\# 9. BUTTONS



Primary button:



\- lime background

\- dark text

\- strong contrast

\- rounded/pill shape

\- medium-to-large padding



Example:



\[ Browse Notes ]



Secondary button:



\- transparent/dark background

\- subtle border

\- white text



Example:



\[ Explore Resources ]



Hover:



\- subtle brightness change

\- slight transform where appropriate

\- no excessive animation



Do not use huge glowing buttons everywhere.



\---



\# 10. CARDS



Resource cards should NOT look like generic white Bootstrap cards.



Preferred appearance:



\- dark surface

\- subtle border

\- moderate radius

\- strong title

\- muted metadata

\- lime accent for important information

\- clean iconography



Example structure:



Resource Type



Data Structures Notes



Data Structures · Semester 3



★★★★★ 4.6



Uploaded by Vansh



\[View Resource]



Cards should have clear hierarchy.



Avoid:



\- excessive shadows

\- excessive gradients

\- giant rounded containers

\- unnecessary decorative icons

\- too much information



\---



\# 11. RESOURCE BROWSING PAGE



The resource browsing page is a functional product page, not a marketing landing page.



It should prioritize usability.



Recommended structure:



Page heading



Short supporting text



Search bar



Filter controls



Resource grid/list



Pagination



Example:



BROWSE RESOURCES



Find notes, papers and study material shared by students.



\[ Search resources... ]



\[ Type ] \[ Semester ] \[ Subject ] \[ Course ]



Resource grid



The browsing experience must remain easy to scan.



Do not sacrifice usability for visual effects.



\---



\# 12. RESOURCE DETAILS PAGE



The resource details page should feel premium but remain information-dense.



Include:



\- title

\- resource type

\- subject

\- semester

\- course

\- uploader

\- rating

\- views

\- downloads

\- description

\- tags

\- download CTA

\- bookmark CTA

\- rating controls

\- report option



Primary download CTA should be visually prominent.



Use lime accent for the primary action.



\---



\# 13. UPLOAD PAGE



The upload page should feel like a professional product form.



Structure:



Large heading



Short explanation



File drop/upload area



Metadata fields



Tags



Submit button



Use:



\- dark surfaces

\- subtle borders

\- clear labels

\- strong focus states

\- good spacing



The upload form must remain easy to understand.



Do not turn every field into a giant animated component.



\---



\# 14. AUTH PAGES



Login and Register should match the overall dark visual identity.



Preferred:



\- centered layout

\- dark background

\- strong heading

\- minimal distractions

\- clear form fields

\- lime primary action



Example:



Welcome back.



Continue discovering useful study resources.



\[ Email ]



\[ Password ]



\[ Login ]



Do not create unnecessary marketing content on authentication screens.



\---



\# 15. BOOKMARKS



Bookmarks should feel like a personal library.



Heading:



"Your Library"



or similar StudySwap-specific wording.



Show saved resources using the same ResourceCard visual system.



Maintain consistency with the Browse page.



\---



\# 16. PROFILE



Profile should feel clean and useful.



Display:



\- profile information

\- college

\- course

\- semester

\- contribution points

\- uploaded resources

\- useful account information



Do not overload the page with dashboard widgets.



\---



\# 17. ADMIN UI



Admin UI should use the same design system but be more functional.



Use:



\- compact tables

\- dark surfaces

\- subtle borders

\- clear status badges

\- clear action buttons

\- responsive layouts



Admin tables must remain readable.



For mobile:



\- allow controlled horizontal scrolling where necessary

\- never break the entire page width



Do not make the admin dashboard unnecessarily flashy.



\---



\# 18. BACKGROUNDS AND VISUAL EFFECTS



Use visual depth carefully.



Possible techniques:



\- subtle radial gradients

\- soft glow around accent elements

\- faint grid/noise textures

\- blurred background shapes

\- image overlays

\- subtle transparency



Do NOT use all effects simultaneously.



The background should support the content rather than compete with it.



\---



\# 19. ANIMATIONS



Animations should feel intentional and premium.



Good:



\- fade-in

\- subtle slide

\- hover translation

\- button micro-interactions

\- card hover

\- smooth page transitions

\- subtle navbar behavior



Avoid:



\- bouncing everything

\- excessive spinning

\- constant floating elements

\- distracting parallax

\- animations that delay usability



Respect reduced-motion preferences where practical.



\---



\# 20. RESPONSIVE DESIGN



The application MUST remain fully usable on:



\- 320px

\- 375px

\- 390px

\- 430px

\- 768px

\- 1024px

\- 1366px

\- 1440px

\- 1920px



Test mobile layouts deliberately.



Pay particular attention to:



\- navbar

\- hero heading

\- buttons

\- search

\- filters

\- resource cards

\- upload form

\- resource details

\- admin tables

\- modals

\- long titles

\- file names



Never allow accidental horizontal page overflow.



Mobile design should be intentionally designed, not simply a desktop layout squeezed into a smaller screen.



\---



\# 21. ACCESSIBILITY



Maintain:



\- sufficient contrast

\- visible keyboard focus

\- semantic HTML

\- accessible buttons

\- accessible form labels

\- meaningful alt text

\- readable text sizes



Do not rely on color alone to communicate status.



\---



\# 22. ICONS



Use the existing Lucide React icon library.



Do not introduce another icon library unless there is a compelling reason.



Icons should:



\- have consistent sizes

\- support meaning

\- not replace important text unnecessarily



Avoid decorative icon overload.



\---



\# 23. IMAGES



Images should have a purpose.



For StudySwap, possible visual concepts include:



\- stacks of notes

\- academic resources

\- students collaborating

\- abstract knowledge/data visuals

\- resource previews

\- subtle educational imagery



Avoid generic corporate stock imagery where possible.



Do not hotlink random external images unless explicitly requested.



\---



\# 24. DESIGN CONSISTENCY



Create reusable design patterns.



Examples:



\- Button

\- Input

\- Badge

\- ResourceCard

\- SectionHeading

\- Modal

\- EmptyState

\- ErrorState

\- LoadingState



Do not create slightly different versions of the same component on every page.



Before creating a new component, check whether an existing component can be reused.



\---



\# 25. ERROR STATES



Error states should match the visual system.



Do not show raw technical errors such as:



"TypeError: Failed to fetch"



when a user-friendly message is available.



Examples:



"Something went wrong."



"Unable to load resources right now."



"Too many requests. Please wait a few minutes and try again."



Keep technical details in the developer console, not the primary UI.



\---



\# 26. LOADING STATES



Use polished loading states.



Prefer:



\- skeleton cards

\- subtle loading indicators

\- stable layout



Avoid large blank screens.



Prevent layout jumping when content loads.



\---



\# 27. EMPTY STATES



Empty states should explain what happened and provide an action.



Example:



"No bookmarks yet."



"Save resources you want to revisit later."



\[ Browse Resources ]



Do not show empty white/blank areas without explanation.



\---



\# 28. DESIGN WORKFLOW



Whenever asked to redesign UI:



STEP 1:

Inspect the current implementation.



STEP 2:

Identify reusable components.



STEP 3:

Identify existing functionality that must remain unchanged.



STEP 4:

Define the visual change before coding.



STEP 5:

Implement the smallest logical section.



STEP 6:

Run the application.



STEP 7:

Test desktop.



STEP 8:

Test mobile.



STEP 9:

Check browser console.



STEP 10:

Verify that existing API functionality still works.



STEP 11:

Only then move to the next section.



Never rewrite the entire frontend blindly.



\---



\# 29. IMPORTANT: FUNCTIONALITY FIRST



Visual improvements must never break:



\- login

\- registration

\- logout

\- authentication persistence

\- resource browsing

\- searching

\- filtering

\- pagination

\- resource details

\- downloads

\- uploads

\- ratings

\- bookmarks

\- reports

\- deletion

\- contribution points

\- admin dashboard



After major UI changes, manually test relevant functionality.



\---



\# 30. REFERENCE WEBSITE RULE



The user may provide websites or screenshots as visual references.



Use them to understand:



\- composition

\- visual hierarchy

\- typography scale

\- spacing

\- color relationships

\- interaction patterns

\- animation philosophy



Do NOT directly clone them.



Do NOT copy proprietary assets.



Create an original StudySwap implementation.



The visual references for this project particularly emphasize:



\- dark cinematic backgrounds

\- bright lime/yellow-green accents

\- very large bold headings

\- rounded navigation containers

\- high-contrast CTAs

\- minimal borders

\- premium product presentation

\- immersive imagery



Translate those characteristics into an original education platform.



\---



\# 31. ANTI-AI-SLOP RULES



Avoid:



\- random gradients

\- purple-blue SaaS gradients

\- excessive glassmorphism

\- excessive rounded cards

\- giant meaningless hero text

\- random emoji

\- excessive shadows

\- unnecessary glowing borders

\- repetitive three-card feature sections

\- generic "AI-powered" marketing language

\- stock dashboard layouts

\- decorative elements without purpose



Every visual element should have a reason.



\---



\# 32. CODE QUALITY



Keep React components maintainable.



Prefer:



\- reusable components

\- clear component responsibilities

\- existing API service layer

\- existing context architecture

\- existing routing

\- clean Tailwind classes

\- minimal duplication



Do not create huge components when a logical reusable component is appropriate.



Do not duplicate API request logic inside multiple components.



\---



\# 33. BEFORE MODIFYING FILES



Always inspect:



\- current component

\- related CSS/Tailwind styles

\- routing

\- API usage

\- responsive behavior



Then make targeted changes.



Do not assume the current implementation.



\---



\# 34. AFTER MODIFYING UI



Always verify:



\- desktop appearance

\- mobile appearance

\- browser console

\- route navigation

\- buttons

\- forms

\- API calls

\- loading states

\- error states

\- no horizontal overflow



For production builds, run:



npm run build



and fix build errors before considering the UI task complete.



\---



\# 35. CHANGE MANAGEMENT



For large UI redesigns:



Work page-by-page.



Recommended order:



1\. Global theme/design tokens

2\. Navbar

3\. Homepage

4\. Resource browsing

5\. Resource cards

6\. Resource details

7\. Login

8\. Register

9\. Upload

10\. Bookmarks

11\. Profile

12\. Admin dashboard

13\. Mobile/responsive polish

14\. Accessibility

15\. Final regression testing



Do not modify all pages simultaneously unless explicitly requested.



\---



\# 36. FINAL PRINCIPLE



StudySwap should look like a serious modern product.



The final interface should communicate:



"Students built a real platform for students."



It should NOT communicate:



"An AI generated a generic CRUD dashboard."



Prioritize:



CLARITY

\+

CHARACTER

\+

USABILITY

\+

CONSISTENCY

\+

PERFORMANCE



over visual gimmicks.

