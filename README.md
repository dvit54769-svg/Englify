# Englify: English learning website

A small English learning website: lessons, practice, quizzes, a level test and saved scores.
Made for the Passerelles numeriques Cambodia design project.

## How to open it

1. Unzip the folder.
2. Double-click `index.html`. No install, no server. `css/style.css` is already compiled.
3. Internet is only needed for the Inter font (Google Fonts). Without internet it uses a system font.

To put it online, upload the folder to GitHub Pages or Netlify.

## Pages (one HTML file each)

| Page | File |
|---|---|
| Home | `index.html` |
| Courses | `courses.html` |
| Course A1, A2, B1 | `course-a1.html`, `course-a2.html`, `course-b1.html` |
| Lessons (18) | `lesson-a1-grammar.html`, `lesson-a1-vocabulary.html`, ... `lesson-b1-writing.html` |
| Practice | `practice.html` |
| Level Test | `level-test.html` |
| Quiz | `quiz.html`, `quiz-a1.html`, `quiz-a2.html`, `quiz-b1.html` |
| Progress | `progress.html` |
| About | `about.html` |
| Log in, Sign up | `login.html`, `signup.html` (demo forms, nothing is saved) |

Each lesson page has the notes ("Learn") and the exercises ("Practice") on the same page.

## Files

```
*.html            the pages (header and footer are repeated on every page)
css/style.css     compiled CSS (generated from scss/, do not edit by hand)
scss/style.scss   Sass entry file: only @use lines
scss/_variables.scss   colors and breakpoints
scss/_tokens.scss      turns the variables into CSS custom properties
scss/_base.scss, _layout.scss, _header.scss, _components.scss, _footer.scss, _responsive.scss   shared styles
scss/_motion.scss      all animation and smoothness (easing, fade-ins, menu, feedback); loads last
scss/_home.scss        home page
scss/_courses.scss     courses, course and lesson pages
scss/_exercises.scss   questions, answer feedback, score box
scss/_progress.scss    progress page
scss/_forms.scss       login, sign up, about (FAQ, contact, team)
js/englify.js     the only JavaScript (about 130 lines), loaded on every page
assets/           logo and favicon
```

## Editing the styles (Sass)

Only needed if you change the design. Install Node.js, then in this folder:

```
npm install
npm run sass
```

`npm run sass` watches `scss/` and rewrites `css/style.css` on every save. Stop it with Ctrl+C.
Change colors in `scss/_variables.scss`.

## How little JavaScript is used

- Multiple-choice answers, the green/red feedback, the explanations, the mobile menu, the FAQ and the contact
  "thank you" message all work with HTML and CSS only.
- `js/englify.js` does five small jobs: play audio (browser text-to-speech), check typed answers, show the
  score, save the best score in the browser (`localStorage`), and fill the Progress page. It also does two
  polish jobs: a soft shadow under the header once you scroll, and a gentle fade-in for blocks below the fold.
- All animations are CSS (`scss/_motion.scss`). Speeds and curves are the `--ease-*` and `--t-*` values in
  `scss/_tokens.scss`: change them there to make the whole site faster or slower. Visitors who turn on
  "reduce motion" in their device settings get no animation at all.

## Good to know

- There is no dark mode. The site always uses the light theme.
- Best scores are saved in the browser. Clearing browser data removes them.
- A lesson counts as complete at 60% or more. Speaking and Writing lessons have no score (self-check).
- Log in, Sign up and the contact form are demos. There is no server.
- To change a lesson, edit its `lesson-*.html` file (notes and questions are plain HTML).
