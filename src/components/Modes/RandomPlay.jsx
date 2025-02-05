import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjs";
import { Howl } from "howler";
import moveSoundFile from "../../assets/sounds/move.mp3";
import captureSoundFile from "../../assets/sounds/capture.mp3";
import checkSoundFile from "../../assets/sounds/check.mp3";
import checkmateSoundFile from "../../assets/sounds/checkmate.mp3";
import pieceImages from "../pieceImages";
import bg from "../../assets/images/bgprofile.jpg";

// Initialize sound effects
const moveSound = new Howl({ src: [moveSoundFile] });
const captureSound = new Howl({ src: [captureSoundFile] });
const checkSound = new Howl({ src: [checkSoundFile] });
const checkmateSound = new Howl({ src: [checkmateSoundFile] });

const ChessboardComponent = () => {
  const chessRef = useRef(null); // Reference to the DOM element for the chessboard
  const boardRef = useRef(null); // Reference to the Chessboard instance
  const [currentStatus, setCurrentStatus] = useState(null); // State to hold the current game status
  const [moves, setMoves] = useState([]); // State to hold the list of moves
  const [mobileMode, setMobileMode] = useState(false);
  const handleCheckboxChange = () => {
    setMobileMode(!mobileMode);
  };
  useEffect(() => {
    const game = new Chess(); // Create a new Chess instance

    const onDragStart = (source, piece, position, orientation) => {
      // Do not pick up pieces if the game is over
      if (game.isGameOver()) {
        console.log("Start a new game from the menu");
        return false;
      }

      // Only pick up pieces for the side to move
      if (
        (game.turn() === "w" && piece.search(/^b/) !== -1) ||
        (game.turn() === "b" && piece.search(/^w/) !== -1)
      ) {
        return false;
      }
    };

    const makeRandomMove = () => {
      if (game.isGameOver()) return;

      let possibleMoves = game.moves();

      // Filter out non-legal moves for black
      possibleMoves = possibleMoves.filter((move) => move.includes("b"));

      // Randomly select a move
      const randomIdx = Math.floor(Math.random() * possibleMoves.length);
      try {
        const move = game.move(possibleMoves[randomIdx]);
        boardRef.current.position(game.fen());

        // Play sound based on move type
        if (move.captured) {
          captureSound.play();
        } else {
          moveSound.play();
        }

        // Update moves state with the latest move
        setMoves((prevMoves) => [
          ...prevMoves,
          { from: move.from, to: move.to },
        ]);
      } catch (error) {
        setCurrentStatus("Black says: Help me move please, I'm overwhelmed");
      }
    };

    const onDrop = (source, target) => {
      removeGreySquares();

      try {
        let move = game.move({
          from: source,
          to: target,
          promotion: "q", // Automatically promote to a queen for simplicity
        });

        // Log the move result
        console.log("The move returns: " + JSON.stringify(move));

        // If the move is illegal, return 'snapback'
        if (move === null) return "snapback";

        // Play sound based on move type
        if (move.captured) {
          captureSound.play();
        } else {
          moveSound.play();
        }

        // Update moves state with the latest move
        setMoves((prevMoves) => [
          ...prevMoves,
          { from: move.from, to: move.to },
        ]);
      } catch (error) {
        console.log(error);
        return "snapback";
      }

      updateStatus(); // Update the game status

      // After white's move, make random move for black
      if (game.turn() === "b") {
        setTimeout(() => {
          makeRandomMove();
        }, 250); // Delay to ensure that the sound plays before the computer's move
      }
    };

    const onMouseoverSquare = (square, piece) => {
      // Get list of possible moves for this square
      const moves = game.moves({
        square: square,
        verbose: true,
      });

      // Exit if there are no moves available for this square
      if (moves.length === 0) return;

      // Highlight the square they moused over
      greySquare(square);

      // Highlight the possible squares for this piece
      for (let i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
      }
    };

    const onMouseoutSquare = (square, piece) => {
      removeGreySquares();
    };

    const onSnapEnd = () => {
      boardRef.current.position(game.fen());
    };

    const updateStatus = () => {
      let status = "";
      let moveColor = "White";

      if (game.turn() === "b") {
        moveColor = "Black";
      }

      // Checkmate?
      if (game.isCheckmate()) {
        status = "Game over, " + moveColor + " is in checkmate.";
        checkmateSound.play();
      } else if (game.inCheck()) {
        status = moveColor + " to move, " + moveColor + " is in check";
        checkSound.play();
      } else {
        status = moveColor + " to move";
      }

      // Update the status
      setCurrentStatus(status);
    };

    const removeGreySquares = () => {
      const squares = document.querySelectorAll(".square-55d63");
      squares.forEach((square) => (square.style.background = ""));
    };

    const greySquare = (square) => {
      const squareEl = document.querySelector(`.square-${square}`);
      if (squareEl) {
        const isBlack = squareEl.classList.contains("black-3c85d");
        squareEl.style.background = isBlack ? "#696969" : "#a9a9a9";
      }
    };

    const config = {
      draggable: true,
      position: "start",
      onDragStart: onDragStart,
      onDrop: onDrop,
      onMouseoverSquare: onMouseoverSquare,
      onMouseoutSquare: onMouseoutSquare,
      onSnapEnd: onSnapEnd,
      pieceTheme: (piece) => pieceImages[piece],
      snapbackSpeed: 500,
      snapSpeed: 100,
    };

    // Initialize Chessboard.js
    boardRef.current = Chessboard(chessRef.current, config);

    // Cleanup function to destroy the chessboard instance
    return () => {
      if (boardRef.current) {
        boardRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      className="lg:mt-4 mt-16 flex h-fit py-32 items-center justify-center w-screen"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "contain" }}
    >
      <div className="w-screen flex flex-col lg:flex-row lg:flex-row mx-auto my-auto">
        <div className="lg:mx-16 w-full lg:w-1/2">
          <div
            ref={chessRef}
            style={{ width: window.innerWidth > 1028 ? "40vw" : "100vw" }}
          ></div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={mobileMode}
                onChange={handleCheckboxChange}
              />
              Mobile Mode
            </label>
          </div>
        </div>

        {!mobileMode && (
          <div className="lg:ml-4 lg:w-1/3 w-full">
            <div className="rounded-xl text-center p-6 px-16  w-full text-2xl bg-green-700 text-white flex-shrink-0">
              Current Status: {currentStatus ? currentStatus : "White to move"}
            </div>
            <div className="mt-4">
              <p className="text-weight-500 mx-2 mx-3 text-center text-xl text-green-500">
                Always promotes to queen.
              </p>

              <table className="w-full border-collapse border border-gray-700 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-800 text-center text-white">
                    <th className="border border-gray-700 px-6 py-3">Move</th>
                    <th className="border border-gray-700 px-6 py-3">From</th>
                    <th className="border border-gray-700 px-6 py-3">To</th>
                  </tr>
                </thead>
                <tbody>
                  {moves.map((move, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-gray-700 text-white text-center"
                          : "bg-gray-600 text-gray-200 text-center"
                      }
                    >
                      <td className="border border-gray-700 px-6 py-4">
                        {index + 1}
                      </td>
                      <td className="border border-gray-700 px-6 py-4">
                        {move.from}
                      </td>
                      <td className="border border-gray-700 px-6 py-4">
                        {move.to}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessboardComponent;