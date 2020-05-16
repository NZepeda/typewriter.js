class TypeWriter {
  constructor({
    elementId,
    speed = 200,
    strings = [],
    loop = false,
    wait = 500,
    cursor = false,
  }) {
    this.elementId = elementId;
    this.speed = speed;
    this.strings = strings;
    this.loop = loop;
    this.characterIndex = 0;
    this.wordIndex = 0;
    this.wait = wait;
    this.cursor = cursor;
    this.textElementId = this.elementId + "typed-text";

    // Initiliaze our listeners and insert elements
    this.initialize();
  }

  initialize() {
    document.addEventListener("beginBackspace", () => {
      this.backspaceType();
    });

    document.addEventListener("nextWord", () => {
      if (this.strings[this.wordIndex + 1] !== undefined) {
        this.wordIndex++;
        this.reset();
        this.begin();
      } else {
        if (this.loop) {
          this.wordIndex = 0;
          this.reset();
          this.begin();
        }
      }
    });

    // insert our new text span
    this.insertTextSpan();

    // Insert the cursor if enabled
    if (this.cursor) {
      this.insertCursor();
    }
  }

  insertTextSpan() {
    document.getElementById(
      this.elementId
    ).innerHTML = `<span id="${this.textElementId}"></span>`;
  }

  insertCursor() {
    const currentHtml = document.getElementById(this.elementId).innerHTML;
    document.getElementById(this.elementId).innerHTML =
      currentHtml +
      `<span id="cursor" style="font-weight: bold; font-size: 1.3em">|</span>`;

    this.initializeCursor();
  }

  initializeCursor() {
    let visible = true;
    setInterval(() => {
      document.getElementById("cursor").style.opacity = visible ? 0 : 1;
      visible = !visible;
    }, 350);
  }

  reset() {
    this.characterIndex = 0;
  }

  backspaceType() {
    const backspace = (intervalId) => {
      if (this.characterIndex === 0) {
        clearInterval(intervalId);
        document.dispatchEvent(new Event("nextWord"));
      }

      const currentText = this.getCurrentText();
      this.setCurrentText(currentText.slice(0, currentText.length - 1));
      this.characterIndex--;
    };

    const backwardIntervalId = setInterval(
      () => backspace(backwardIntervalId),
      this.speed
    );
  }

  getCurrentText() {
    return document.getElementById(this.textElementId).innerHTML;
  }

  setCurrentText(newString) {
    document.getElementById(this.textElementId).innerHTML = newString;
  }

  typeForward() {
    const type = (intervalId) => {
      if (this.characterIndex === this.strings[this.wordIndex].length) {
        clearInterval(intervalId);

        // If loop is false && we're at the final string, don't backspace anymore
        if (!this.loop && this.strings[this.wordIndex + 1] === undefined) {
          return;
        } else {
          // Wait before we begin backspacing
          setTimeout(() => {
            document.dispatchEvent(new Event("beginBackspace"));
          }, this.wait);
        }
      }
      const currentText = this.getCurrentText();
      this.setCurrentText(
        currentText + this.strings[this.wordIndex].charAt(this.characterIndex)
      );
      this.characterIndex++;
    };

    /* Set our typing interval to the speed passed in */
    const forwardIntervalId = setInterval(
      () => type(forwardIntervalId),
      this.speed
    );
  }

  begin() {
    this.typeForward();
  }
}
