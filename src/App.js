
import './App.css';
import { useState, useEffect, Fragment } from "react";

function App() {

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [blankIndexes, setBlankIndexes] = useState({});  


  useEffect(() => {
    setBlankIndexes({});
  }, [input]);

  function handleSpanClick(lnIdx, wdIdx) {
    let nextBlankIndexes = {};
    
    if (blankIndexes[lnIdx] && blankIndexes[lnIdx].includes(wdIdx)) {
      nextBlankIndexes = {
        ...blankIndexes,
        [lnIdx]: blankIndexes[lnIdx].filter((idx) => idx != wdIdx)
      };
    } else if (blankIndexes[lnIdx]) {
      nextBlankIndexes = {
        ...blankIndexes,
        [lnIdx]: [...blankIndexes[lnIdx], wdIdx].sort()
      };
    } else {
      nextBlankIndexes = {
        ...blankIndexes,
        [lnIdx]: [wdIdx]
      };
    }

    setBlankIndexes(nextBlankIndexes);
  }

  function getQuestionString() {
    let q = "";
    input.split("\n").forEach((line, lineIdx) => {
      const split = line.split(" ");
      split.forEach((w, wordIdx) => {
        const isSelected = blankIndexes[lineIdx] && blankIndexes[lineIdx].includes(wordIdx);
        q += isSelected ? "_____ , " : `${w} `;
      });
      q += "\n";
    });

    return `"question": "${q}"`;
  }

  function getAnswersString() {
    let answers = "";
    input.split("\n").forEach((line, lineIdx) => {
      if (blankIndexes[lineIdx]) {
        const lineSplit = line.split(" ");
        lineSplit.forEach((w, i) => {
          if (blankIndexes[lineIdx].includes(i)) {
            answers += `${w}, `;
          }
        })
      }
    });

    if (answers.charAt(answers.length - 1) == " ") {
      answers = answers.slice(0, answers.length - 2);
    }

    return `"answer": "${answers}"`;

  }

  return (
   <div className="main-container">
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          />
      </div>

      <div className="click-container">
        {input.split("\n").map((ln, lnIdx) => {
          return (
            <Fragment key={lnIdx}>
              {ln.split(" ").map((wd, wdIdx) => {
                const isClicked = blankIndexes[lnIdx] && blankIndexes[lnIdx].includes(wdIdx);
                const className = isClicked ? "wd clicked" : "wd";

                return (
                  <span
                    key={`word-${lnIdx}-${wdIdx}`}
                    className={className}
                    onClick={() => {handleSpanClick(lnIdx, wdIdx)}}>
                    {wd}
                  </span>
                );
              })}
              <br/>
            </Fragment>
          )
        })}
      </div>

      <div className="output-container">
        <div className="output-inner">
          {`{\n\t${getQuestionString()} \n\n\t ${getAnswersString()} \n}`}         
        </div>
      </div>

      <div className="buttons">
        <button onClick={() => navigator.clipboard.writeText(`{\n\t${getQuestionString()} \n\n\t ${getAnswersString()} \n}`)}>
          Copy
        </button>
        <button onClick={() => setInput("")}>
          Clear
        </button>
      </div>
   </div>
  );
}

export default App;
