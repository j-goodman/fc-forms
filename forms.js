var formPages;
var formInputs;
var focusedIndex;
var button;
var validations = {};

function setupForms () {
  /*
    Activate the first page of the form, then add onclick event to the
    Enter button and execute the functions to set up Checklists and
    add onfocus events to text inputs.
  */
  var mainForm;
  var i;
  var sidebar;
  button = document.getElementsByClassName('forms-advance-button')[0];
  mainForm = document.getElementsByClassName('forms-main')[0];
  sidebar = document.getElementsByClassName('sidebar')[0];
  formPages = document.getElementsByClassName('forms-page');
  formPages[0].className = 'forms-page current-page';
  currentPageIndex = 0;
  setupChecklists();
  button.onclick = revealForm.bind(
    null, {button: button, mainForm: mainForm, sidebar: sidebar}
  );
  formInputs = formPages[currentPageIndex].getElementsByClassName('forms-input');
  addOnfocusEvents(formInputs);
}

function revealForm (elements) {
  /*
    Minimize the page sidebar to reveal the form.
  */
  elements.mainForm.className = 'forms-main';
  elements.sidebar.className = 'sidebar';
  elements.button.innerText = "Enter";
  setTimeout(formFocus.bind(null, 0), 500);
  elements.button.onclick = advanceFocus;
}

function formFocus (index) {
  /*
    Focus the element at the given index, update the focusedIndex variable
    to match the new focused element.
  */
  formInputs[index].childNodes[1].focus();
  focusedIndex = index;
}

function advanceFocus () {
  /*
    If the next input on the page is of a focusable type, advance the focus
    to that element. If there aren't any more focusable elements on the page,
    advance to the next page.
  */
  if (document.activeElement === document.body) {
    advancePage();
    return true;
  }
  if (validations[formInputs[focusedIndex].childNodes[1].accept](
    formInputs[focusedIndex].childNodes[1].value
  )) {
    nextFocus = focusedIndex + 1;
    if (nextFocus >= formInputs.length) {
      nextFocus = 0;
      advancePage();
    }
    formFocus(nextFocus);
  } else {
    formInputs[focusedIndex].className = 'forms-input reject-input';
    window.setTimeout(function () {
      this.className = 'forms-input';
    }.bind(formInputs[focusedIndex]), 200);
  }
}

function addOnfocusEvents (formInputs) {
  /*
    Add onfocus events to focusable input elements to cause them to update the
    Enter button's active state based on their validation function.
  */
  for (i = 0; i < formInputs.length; i++) {
    formInputs[i].childNodes[1].index = i;
    formInputs[i].childNodes[1].onfocus = function () {
      if (this.accept && validations[this.accept](this.value)) {
        button.className = 'forms-advance-button';
      } else if (this.accept) {
        button.className = 'forms-advance-button inactive';
      }
      focusedIndex = this.index;
    }.bind(formInputs[i].childNodes[1]);
  }
}

function advancePage () {
  /*
    Advance to the next page of the form. manage the transition animation and
    add onfocus events to the new page's focusable inputs.
  */
  var i;
  for (i = 0; i < formInputs.length; i++) {
    if (formInputs[i].childNodes[1].accept) {
      if (!validations[formInputs[i].childNodes[1].accept](
        formInputs[i].childNodes[1].value
      )) {
        formInputs[i].className = 'forms-input reject-input';
        window.setTimeout(function () {
          this.className = 'forms-input';
        }.bind(formInputs[i]), 200);
        return false;
      }
    }
  }

  formPages[currentPageIndex].style.left = '-' + window.innerWidth + 'px';
  formPages[currentPageIndex].style.zIndex = 2;
  setTimeout(function () {
    this.className = 'forms-page';
    this.style.left = 0;
    this.style.zIndex = 0;
  }.bind(formPages[currentPageIndex]), 500);

  currentPageIndex += 1;
  currentPageIndex = currentPageIndex >= formPages.length ? 0 : currentPageIndex;

  formPages[currentPageIndex].style.opacity = 0;
  formPages[currentPageIndex].className = 'forms-page current-page';
  setTimeout(function () {
    this.style.opacity = '1';
  }.bind(formPages[currentPageIndex]), 50);
  formInputs = formPages[currentPageIndex].getElementsByClassName('forms-input');

  addOnfocusEvents(formInputs);
}

function setupChecklists () {
  /*
    Set up the two kinds of checklists, multi, whose elements toggle between
    selected and unselected on click, and single, which can only have a single
    element selected at a time.
  */
  var checkboxes;
  var i;
  var j;
  var multiChecklists;
  var singleChecklists;

  multiChecklists = document.getElementsByClassName('multi-checklist');
  for (i = 0; i < multiChecklists.length; i++) {
    checkboxes = multiChecklists[i].getElementsByClassName('forms-checkbox');
    for (j = 0; j < checkboxes.length; j++) {
      checkboxes[j].onclick = function () {
        if (this.className.includes('selected')) {
          this.classList.remove('selected');
        } else {
          this.classList.add('selected');
        }
      };
    }
  }

  singleChecklists = document.getElementsByClassName('single-checklist');
  for (i = 0; i < singleChecklists.length; i++) {
    checkboxes = singleChecklists[i].checkboxes = singleChecklists[i].getElementsByClassName('forms-checkbox');
    singleChecklists[i].clear = function () {
      var i;
      for (i = 0; i < this.checkboxes.length; i++) {
        this.checkboxes[i].classList.remove('selected');
      }
    };
    for (j = 0; j < checkboxes.length; j++) {
      checkboxes[j].parent = singleChecklists[i];
      checkboxes[j].onclick = function () {
        if (this.className.includes('selected')) {
          this.classList.remove('selected');
        } else {
          this.parent.clear();
          this.classList.add('selected');
        }
      };
    }
  }
}

window.onload = setupForms;

window.onkeyup = function (event) {
  /*
    Update Enter button's status based on whether the active element's value
    is valid. Set Enter key to mimic functionality of Enter button.
  */
  var nextFocus;
  if (document.activeElement && document.activeElement.accept) {
    if (validations[document.activeElement.accept](document.activeElement.value)) {
      button.className = 'forms-advance-button';
    } else {
      button.className = 'forms-advance-button inactive';
    }
  }
  if (event.keyCode === 13) {
    advanceFocus();
  }
};
