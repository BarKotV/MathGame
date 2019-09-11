import React, {Component} from "react";
import ReactDOM from "react-dom";
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
} from 'react-router-dom';

import './../sass/style.scss'; // adres do głównego pliku SASS

class App extends Component{
    render() {
        return(
            <HashRouter>
                <>
                    <Switch>
                        <Route exact path="/" component={MathAnswersGame} />
                        <Route path='/:id' component={MathAnswersGame} />
                    </Switch>
                </>
            </HashRouter>
        )
    }
}


class MathAnswersGame extends Component {


    state = {
        mathAction: [],
        time: 25000,
        checkMath: null,
        checkPlayer: "",
        playerScore: 0,
        game: false,
    };

    chapter = {
        a: ["+"],
        b: ["-"],
        c: ["*"],
        ab: ["+", "-"],
        abc: ["+", "-", "*"],
    };


    randomNumber = () => {
        const number = Math.round(Math.random() * (10 - 1 + 1) + 1);
        return number;
    };

    randomFromArray = tab => {

        const randomIndex = Math.round(Math.random() * (tab.length - 1));
        return tab[randomIndex];
    };

    findOperators = tab => {
        const positionOperators = [];
        tab.reduce(function (a, e, i) {
            if (e === '*' || e === '-' || e === '+') {
                a.push(i);
            }
            return a;
        }, positionOperators);
        return positionOperators
    };

    findBrackets = tab => {
        const positionOperators = [];
        tab.reduce(function (a, e, i) {
            if (e === '(' || e === ')') {
                a.push(i);
            }
            return a;
        }, positionOperators);
        return positionOperators
    };

    firstMathAction = operator => {
        const tab = [this.randomNumber(), this.randomFromArray(operator), this.randomNumber()];
        for (let i = 0; i < Math.floor(this.state.playerScore / 4); i++) {
            tab.push(this.randomFromArray(operator), this.randomNumber());
        }
        return tab;
    };

    addBrackets = (tab, index, count) => {

        if (count !== 2) {
            tab.splice(index - 1, 0, "(");
            tab.splice(index + 3, 0, ")");
        } else {
            tab.splice(index - 1, 0, "(");
            tab.splice(index + 3, 0, ")");
            const tabop = this.findOperators(tab);
            let index2 = this.randomFromArray(tabop);
            const tabbracketsp = this.findBrackets(tab);
            const position1 = tabbracketsp[0];
            const position2 = tabbracketsp[1];



            while (index + 1 === index2 || index2 === tab.length - 2 || (index2 > position1 - 3 && index2  < position2 + 3)) {

                index2 = this.randomFromArray(tabop);
            }

            // while(index  +5 < tab.length || index -5 < tab.length){
            //     index2 = this.randomFromArray(tabop);
            // }

            tab.splice(index2 -1, 0, "(");
            tab.splice(index2 + 3, 0, ")");
        }
        return tab
    };

    randBrackets = (tab, count) => {
        const tabop = this.findOperators(tab);
        this.addBrackets(tab, this.randomFromArray(tabop), count);
        return eval(tab.join(" "));
    };


    mathAction = () => {

        // Zadanie matematyczne
        let finalTab;
        const tab = this.firstMathAction(this.chapter.abc);
        const operatorsPosition = this.findOperators(tab);


        if (operatorsPosition.length < 2) {
            finalTab = eval(tab.join(" "))


        } else if (operatorsPosition.length <= 5) {
            finalTab = this.randBrackets(tab);

        } else if (operatorsPosition.length > 5) {
            finalTab = this.randBrackets(tab, 2);

        }


        this.setState({
            mathAction: tab,
            checkMath: finalTab,
        });
        console.log(finalTab);

    };


    handleClick = e => {
        e.preventDefault();
        this.setState({
            checkPlayer: e.target.value,
        });
        if (Number(this.state.checkPlayer) === this.state.checkMath) {
            this.setState({
                playerScore: this.state.playerScore + 1,
                time: 25000
            });
            this.mathAction();
        }
    };

    componentWillUnmount() {
        clearInterval(this.intervalid);
    }


    inputActionValue = e => {
        let number = e.target.value;

        if (isNaN(Number(number)) && number !== "-") {
            number = "";
        }
        this.setState({
            checkPlayer: number
        })
    };

    changeGame = () => {
        this.mathAction();

        this.intervalid = setInterval(() => {
            const time = this.state.time;
            if (time === 0) {
                clearInterval(this.intervalid);
                this.setState({
                    game: !this.state.game,
                    playerScore: 0,
                    time: 25000,
                })
            } else {
                this.setState({
                    time: time - 1000
                })
            }

        }, 1000);
        this.setState({
            game: !this.state.game,
            time: 25000,
            playerScore: 0,
            checkPlayer: ""
        })
    };

    render() {

        let game = "";
        if (!this.state.game) {
            game = <Start game={this.changeGame}/>;
        } else {
            game = (
                <div className="container">
                    <div className="game">
                        <div>
                            <form>
                                <p className="game__item--center">{this.state.mathAction} =
                                    <input className="game__item--small" type="text" placeholder="Tutaj wpisz wynik"
                                           onChange={this.inputActionValue}
                                           value={this.state.checkPlayer}/></p>
                                <button className="game__item--change" onClick={this.handleClick}>Zatwierdz Odpowiedz
                                </button>
                            </form>
                            <p>Zostało ci {this.state.time / 1000} sekund</p>
                            <p>Ilość punktów: {this.state.playerScore}</p>
                        </div>
                    </div>
                </div>
            )
        }


        return (
            <>
                <TopBar />
                <Route exact path="/" render={ () => <Main id={1}/>} />
                <Route exact path="/1" render={ () => <Main id={1}/>} />
                <Route exact path="/2" render={ () => <Main id={2}/>} />
                {/*<Main id={typeof this.props.match.params.id === "undefined" ? 1 : this.props.match.params.id }/>*/}
                {game}
                <BottomBar/>
            </>
        )


    }
}

class TopBar extends Component {
    render() {
        return (
            <div className="nav">
                <div className="container">
                    <div className="nav__items">
                        <Logo/>
                        <Nav/>
                    </div>
                </div>
            </div>
        )
    }
}

class BottomBar extends Component {
    render() {
        return (
            <div className="nav fix">
                <div className="container">
                </div>
            </div>
        )
    }
}

class Logo extends Component {
    render() {
        return (
            <div className="logo__item">
                <h1>Math</h1>
                <i className="fas logo fa-calculator"></i>
            </div>
        )
    }
}

class Nav extends Component {
    render() {
        return (
            <div className="nav__items">
                <nav>
                    <ul className="nav__items--flex">
                        <li className="nav__items--space"><NavLink className="nav__items--lvha" to="/1">Home</NavLink></li>
                        <li className="nav__items--space"><NavLink className="nav__items--lvha" to="/2">Chapter 1</NavLink></li>
                    </ul>
                </nav>
            </div>
        )
    }
}

class Main extends Component {
    state = {
        txt: "",
    };

    load = () =>{
        let {id} = this.props;
        if(typeof id === "undefined"){
            id=1;
        }

        const url = `http://localhost:3000/data/${id}`;
        fetch(url)
            .then(resp => resp.json())
            .then(d => {
                this.setState({
                    txt: d,
                })
            })
    };

    componentDidMount() {
            this.load();


    }

    // componentDidUpdate() {
    //     this.load();
    // }
    //
    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     // console.log(nextProps, nextState)
    //      if(Number(nextProps.id) === nextState.txt.id){
    //         return true
    //     }
    //     return false
    //
    // }

    render() {
        const {txt} = this.state;
        if (txt === "") {
            return null
        }

        const examplesPP = txt.examplesPP.map(ele => <li key={ele}> {ele}</li>);
        let examplesPP2;
        if(typeof txt.examplesPP2 !== "undefined" ){
             examplesPP2 = txt.examplesPP2.map(ele => <li key={ele}> {ele}</li>);
        }
        const examplesMM = txt.examplesMM.map(ele => <li key={ele}> {ele}</li>);
        const examplesMM2 = txt.examplesMM2.map(ele => <li key={ele}> {ele}</li>);

        return (
            <div className="container">
                <div className="main">
                    <h1 className="main__item--bold">{txt.title}</h1>
                    <p className="main__content">
                        {txt.content}
                    </p>

                    <h2 className="main__item--bold main__content">{txt.nextT}</h2>
                    <ul className="main__content">
                        {examplesPP}
                    </ul>
                    <ul className="main__content">
                        {examplesPP2}
                    </ul>
                    <h2 className="main__item--bold main__content">{txt.lastT}</h2>
                    <ul className="main__content">
                        {examplesMM}
                    </ul>
                    <ul className="main__content">
                        {examplesMM2}
                    </ul>
                    <p className="main__content">
                        {txt.howtoplay}
                    </p>
                </div>
            </div>
        )
    }
}

class Start extends Component {

    handleClick = () => {
        this.props.game();
    };

    render() {
        return (
            <div className="start">
                <div className="start__item">
                    <p>Poćwicz dodawanie i odejmowanie. Kliknij w przycisk poniżej i ciesz się grą !</p>
                    <button className="game__item--change" onClick={this.handleClick}>Zagraj w Grę!</button>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));
