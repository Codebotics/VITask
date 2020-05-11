# Contribution Guidelines

As our project is open-source and public. We encourage you to find bugs and fix them. We may even add your name in the `Our Team` page. But to make sure a clean experience for all the contributers, please make sure you follow certain guidelines.

We encourage you to work on a seperate local branch and submit a Pull Request. Follow the following guidelines while submitting a Pull Request. **We will not approve any PR which does not follow guidelines**


---
## Pull Request Guidelines

Your PR description should contain following format

### Type of PR

- [ ] Issue Fix
- [ ] Feature

### App Updated

- [ ] Mobile App (React Native)
- [ ] Mobile App (Flutter)
- [ ] Desktop App (Electron JS)
- [ ] Web Server (Python)
- [ ] Website (HTML, CSS, JS)
- [ ] Anything else (Mention)

### Details Fixed
_This section should contain details about what you fixed and files you changed_

---
## Git Guidelines

Make sure you know basic knowlege of `git` commands. Some important tips:

* Always update your `master` branch using `git pull origin master`.
* Create seperate branch while working and switch to that branch using `git checkout -b branch_name`
* Make changes and commit changes to this branch.
* Push branch to github using `git push -u origin branch_name`
* While working on the branch, be sure to rebase with master to pull in mainline changes:
  ```
  git checkout master
  git pull origin master
  git checkout your_branch
  git rebase master
* Approve your Pull requests from GitHub or wait for approval.
* For more information look into [this post](https://github.com/codepath/android_guides/wiki/Collaborating-on-Projects-with-Git).

**While working on the project make sure you update and create `.gitignore` files in the directories if you create some personal and temperoray files.**

---

