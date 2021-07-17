import { Component } from '@angular/core';
import { JKFPlayer } from 'json-kifu-format';

enum Colors {
  FirstPlayer = 'FirstPlayer',
  SecondPlayer = 'SecondPlayer'
}

enum PieceKind {
  Fu = 'Fu',
  Kyousha = 'Kyousha',
  Keima = 'Keima',
  Gin = 'Gin',
  Kin = 'Kin',
  Hisha = 'Hisha',
  Kaku = 'Kaku',
  Ou = 'Ou'
}

enum UserState {
  HoldingPiece = 'HoldingPiece'
}

class PieceOnKomadi {
  kind: PieceKind;
  constructor(kind: PieceKind) {
    this.kind = kind;
  }
}

class ShogiPieceState {
  colors: Colors;
  isPromoted: boolean;
  pieceKind: PieceKind;

  constructor(colors: Colors, pieceKind: PieceKind) {
    this.colors = colors;
    this.pieceKind = pieceKind;
    this.isPromoted = false;
  }
}

class ChosenPiece {
  shogiPieceState: ShogiPieceState;
  rowNum: number;
  colNum: number;

  constructor(
    shogiPieceState: ShogiPieceState,
    rowNum: number,
    colNum: number
  ) {
    this.shogiPieceState = shogiPieceState;
    this.rowNum = rowNum;
    this.colNum = colNum;
  }
}

class PiecePosition {
  constructor(public rowNum: number, public colNum: number) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shogi-front';
  pieceKind = PieceKind;
  colors = Colors;
  rowNums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  colNums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  boardState: (ShogiPieceState | null)[][];
  firstPlayerKomadai: PieceOnKomadi[] = [];
  secondPlayerKomadai: PieceOnKomadi[] = [];
  nextPossiblePositionArray: PiecePosition[] = [];

  chosenPiece: ChosenPiece | null = null;

  jkfPlayer: JKFPlayer | null = null;

  isDragging: boolean = false;
  pieceHeight: number = 0;
  pieceWidth: number = 0;
  pieceTop: number = 0;
  pieceLeft: number = 0;

  cellClick(event: Event, rowNum: number, colNum: number) {
    console.log(`${rowNum} ${colNum} is clicked`);
    if (this.chosenPiece == null) {
      //駒を持っていない場合
      const chosenCell = this.boardState[rowNum][colNum];
      if (chosenCell != null) {
        this.chosenPiece = new ChosenPiece(chosenCell, rowNum, colNum);
        this.setNextPossiblePosition(this.chosenPiece);
      }
    } else {
      const chosenCell = this.boardState[rowNum][colNum];
      //駒を持っている場合

      //clickした部分が移動可能なマスだった場合
      if (this.checkIfNextPossiblePosition(rowNum, colNum)) {
        //次のマスがnullの場合
        if (chosenCell == null) {
          this.boardState[rowNum][colNum] = this.chosenPiece.shogiPieceState;
          this.boardState[this.chosenPiece.rowNum][
            this.chosenPiece.colNum
          ] = null;
          this.chosenPiece = null;
        } else {
          //次のマスには駒がすでにある場合
          this.boardState[rowNum][colNum] = this.chosenPiece.shogiPieceState;
          this.boardState[this.chosenPiece.rowNum][
            this.chosenPiece.colNum
          ] = null;

          this.firstPlayerKomadai.push(new PieceOnKomadi(chosenCell.pieceKind));
          this.chosenPiece = null
        }
      } else {
      }
    }

    //this.boardState[rowNum][colNum] = null;
    //const target = event.target as HTMLInputElement;

    //if (target) {
    //this.pieceHeight = target.height;
    //this.pieceWidth = target.width;
    //}
  }

  setNextPossiblePosition(chosenPiece: ChosenPiece) {
    this.nextPossiblePositionArray = [];

    switch (chosenPiece.shogiPieceState.pieceKind) {
      case PieceKind.Fu: {
        this.setNextPossibleFuPosition(chosenPiece);
        break;
      }
      case PieceKind.Kyousha: {
        this.setNextPossibleKyoshaPosition(chosenPiece);
        break;
      }
      case PieceKind.Keima: {
        this.setNextPossibleKeimaPosition(chosenPiece);
        break;
      }

      case PieceKind.Gin: {
        this.setNextPossibleGinPosition(chosenPiece);
        break;
      }
      case PieceKind.Kin: {
        this.setNextPossibleKinPosition(chosenPiece);
        break;
      }
      case PieceKind.Ou: {
        this.setNextPossibleOuPosition(chosenPiece);
        break;
      }

      default: {
      }
    }
  }

  setNextPossibleFuPosition(chosenPiece: ChosenPiece) {
    let rowNum = chosenPiece.rowNum;
    let colNum = chosenPiece.colNum;
    if (chosenPiece.shogiPieceState.colors == Colors.FirstPlayer) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum)
      );
    } else {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum + 1, colNum)
      );
    }
  }

  setNextPossibleKyoshaPosition(chosenPiece: ChosenPiece) {
    let rowNum = chosenPiece.rowNum;
    let colNum = chosenPiece.colNum;
    for (let i = 0; i < rowNum; i++) {
      this.nextPossiblePositionArray.push(new PiecePosition(i, colNum));
    }
  }

  checkIfValidPosition(rowNum: number, colNum: number) {
    if (rowNum >= 0 && rowNum < 9 && colNum >= 0 && colNum < 9) {
      return true;
    } else {
      return false;
    }
  }

  setNextPossibleGinPosition(chosenPiece: ChosenPiece) {
    let rowNum = chosenPiece.rowNum;
    let colNum = chosenPiece.colNum;

    if (this.checkIfValidPosition(rowNum - 1, colNum)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum)
      );
    }
    if (this.checkIfValidPosition(rowNum - 1, colNum - 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum - 1)
      );
    }
    if (this.checkIfValidPosition(rowNum - 1, colNum + 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum + 1)
      );
    }

    if (this.checkIfValidPosition(rowNum + 1, colNum - 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum + 1, colNum - 1)
      );
    }
    if (this.checkIfValidPosition(rowNum + 1, colNum + 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum + 1, colNum + 1)
      );
    }
  }

  moveToNextPossiblePosition(chosenPiece: ChosenPiece) {}

  setNextPossibleKinPosition(chosenPiece: ChosenPiece) {
    let rowNum = chosenPiece.rowNum;
    let colNum = chosenPiece.colNum;

    if (this.checkIfValidPosition(rowNum - 1, colNum)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum)
      );
    }
    if (this.checkIfValidPosition(rowNum - 1, colNum - 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum - 1)
      );
    }
    if (this.checkIfValidPosition(rowNum - 1, colNum + 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum + 1)
      );
    }
    if (this.checkIfValidPosition(rowNum + 1, colNum)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum + 1, colNum)
      );
    }

    if (this.checkIfValidPosition(rowNum, colNum + 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum, colNum + 1)
      );
    }

    if (this.checkIfValidPosition(rowNum, colNum - 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum, colNum - 1)
      );
    }
  }

  setNextPossibleOuPosition(chosenPiece: ChosenPiece) {
    let rowNum = chosenPiece.rowNum;
    let colNum = chosenPiece.colNum;

    if (this.checkIfValidPosition(rowNum - 1, colNum)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum)
      );
    }
    if (this.checkIfValidPosition(rowNum - 1, colNum - 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum - 1)
      );
    }
    if (this.checkIfValidPosition(rowNum - 1, colNum + 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 1, colNum + 1)
      );
    }
    if (this.checkIfValidPosition(rowNum + 1, colNum)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum + 1, colNum)
      );
    }

    if (this.checkIfValidPosition(rowNum, colNum + 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum, colNum + 1)
      );
    }

    if (this.checkIfValidPosition(rowNum, colNum - 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum, colNum - 1)
      );
    }

    if (this.checkIfValidPosition(rowNum + 1, colNum - 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum + 1, colNum - 1)
      );
    }

    if (this.checkIfValidPosition(rowNum + 1, colNum + 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum + 1, colNum + 1)
      );
    }
  }

  setNextPossibleKeimaPosition(chosenPiece: ChosenPiece) {
    let rowNum = chosenPiece.rowNum;
    let colNum = chosenPiece.colNum;

    if (this.checkIfValidPosition(rowNum - 2, colNum - 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 2, colNum - 1)
      );
    }
    if (this.checkIfValidPosition(rowNum - 2, colNum + 1)) {
      this.nextPossiblePositionArray.push(
        new PiecePosition(rowNum - 2, colNum + 1)
      );
    }
  }

  checkIfNextPossiblePosition(rowNum: number, colNum: number): boolean {
    for (var nextPossiblePosition of this.nextPossiblePositionArray) {
      if (
        nextPossiblePosition.rowNum == rowNum &&
        nextPossiblePosition.colNum == colNum
      ) {
        return true;
      }
    }

    return false;
  }

  onMouseUp(event: MouseEvent, rowNum: number, colNum: number) {}

  pieceKindToSVGPath(pieceKind: PieceKind | undefined) {
    if (pieceKind) {
      switch (pieceKind) {
        case PieceKind.Fu: {
          return './assets/images/fu.svg';
        }
        case PieceKind.Kyousha: {
          return './assets/images/kyousha.svg';
        }
        case PieceKind.Keima: {
          return './assets/images/keima.svg';
        }
        case PieceKind.Gin: {
          return './assets/images/gin.svg';
        }
        case PieceKind.Kin: {
          return './assets/images/kin.svg';
        }
        case PieceKind.Ou: {
          return './assets/images/ou.svg';
        }
        case PieceKind.Hisha: {
          return './assets/images/hisha.svg';
        }
        case PieceKind.Kaku: {
          return './assets/images/kaku.svg';
        }
        default: {
          return './assets/images/empty.svg';
        }
      }
    } else {
      return './assets/images/empty.svg';
    }
  }

  clickForward() {
    if (this.jkfPlayer) {
      this.jkfPlayer.forward();
      console.log(this.jkfPlayer.getReadableKifu());
      const move = this.jkfPlayer.getMove();
      const x = move?.from?.x;
      const y = move?.from?.y;
      if (x && y) {
        let chosenPiece = this.boardState[y - 1][9 - x];
        const next_x = move?.to?.x;
        const next_y = move?.to?.y;
        if (next_x && next_y) {
          const existingPiece = this.boardState[next_y - 1][9 - next_x];
          if (existingPiece) {
            if (move.color == 0) {
              this.firstPlayerKomadai.push(
                new PieceOnKomadi(existingPiece.pieceKind)
              );
            } else {
              this.secondPlayerKomadai.push(
                new PieceOnKomadi(existingPiece.pieceKind)
              );
            }
          }
          this.boardState[next_y - 1][9 - next_x] = chosenPiece;
          this.boardState[y - 1][9 - x] = null;
        }
      }
    }
  }

  getPiece(x: number, y: number) {
    return this.boardState[y - 1][9 - x];
  }

  clickBackward() {}

  constructor() {
    fetch('assets/kifus/kifu1.txt')
      .then(response => response.text())
      .then(data => {
        this.jkfPlayer = JKFPlayer.parseKIF(data);
      });
    this.boardState = [
      [
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Kyousha),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Keima),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Gin),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Kin),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Ou),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Kin),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Gin),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Keima),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Kyousha)
      ],
      [
        null,
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Hisha),
        null,
        null,
        null,
        null,
        null,
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Kaku),
        null
      ],
      [
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.SecondPlayer, PieceKind.Fu)
      ],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Fu)
      ],
      [
        null,
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Hisha),
        null,
        null,
        null,
        null,
        null,
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Kaku),
        null
      ],

      [
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Kyousha),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Keima),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Gin),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Kin),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Ou),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Kin),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Gin),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Keima),
        new ShogiPieceState(Colors.FirstPlayer, PieceKind.Kyousha)
      ]
    ];

    //for (var i: number = 0; i < 9; i++) {
    //for (var j: number = 0; j < 9; j++) {
    //if (i < 3) {
    //let state = this.boardState[i][j]
    //if (state) {
    //state.colors = Colors.SecondPlayer;
    //}
    //} else {
    //this.boardState[i][j]?.colors = Colors.FirstPlayer;
    //}
    //}
    //}
  }
}
