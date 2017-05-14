import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { instanceOf } from 'prop-types';
import Cookies from 'universal-cookie';

class App extends Component {
  componentWillMount() {
    const cookies = new Cookies();

    this.setState({
        firstMeal: cookies.get('firstMeal') || {pasta: null, groundBeef: null},
        normalMeal: cookies.get('normalMeal') || {pasta: null, groundBeef: null},
        thisMeal: {pasta: null, groundBeef: null},
        penne_initial: cookies.get('penne_initial') || '',
        ground_beef_initial: cookies.get('ground_beef_initial') || '',
        penne_after: cookies.get('penne_after') || '',
        ground_beef_after: cookies.get('ground_beef_after') || '',
        penne_eating: cookies.get('penne_eating') || '',
        ground_beef_eating: cookies.get('ground_beef_eating') || '',
        penne_cold: cookies.get('penne_cold') || '',
        ground_beef_cold: cookies.get('ground_beef_cold') || '',
        penne_this: cookies.get('penne_this') || '',
        ground_beef_this: cookies.get('ground_beef_this') || '',
        normal_penne: cookies.get('ground_beef_this') || '',
        normal_ground_beef: cookies.get('ground_beef_this') || '',
      });
  }
 
  updateData(event) {
    const cookies = new Cookies();
    const penneGperServing = 56;
    const groundBeefGperServing = 113.39;
    const normalPasta = 150;
    const normalGroundBeef = 100;

    const value = event.target.id === 'ground_beef_initial' ? event.target.value * 453.592 : event.target.value;
    cookies.set(event.target.id, value /*, { path: '/' }*/ );

    this.setState({[event.target.id]: value}, () => {
      this.setState({ firstMeal: {
          pasta: this.roundDecimal(this.firstMeal(this.state, 'penne') / penneGperServing),
          groundBeef: this.roundDecimal(this.firstMeal(this.state, 'ground_beef') / groundBeefGperServing),
        }
      }, () => {
        cookies.set('firstMeal', this.state.firstMeal /*, { path: '/' }*/ );

        const adjustedPenne = +this.state['penne_cold'] / (+this.state['penne_eating'] / +this.state['penne_after']);
        const adjustedGroundBeef = +this.state['ground_beef_cold'] / (+this.state['ground_beef_eating'] / +this.state['ground_beef_after']);

        this.setState({ normalMeal: {
            pasta: this.roundDecimal(this.calculateMeal(this.state.penne_initial, adjustedPenne, normalPasta) / penneGperServing),
            groundBeef: this.roundDecimal(this.calculateMeal(this.state.ground_beef_initial, adjustedGroundBeef, normalGroundBeef) / groundBeefGperServing),
          }
        }, () => {
          cookies.set('normalMeal', this.state.normalMeal /*, { path: '/' }*/ );

          this.setState({ thisMeal: {
              pasta: this.roundDecimal(this.calculateMeal(this.state.penne_initial, adjustedPenne, +this.state.penne_this) / penneGperServing),
              groundBeef: this.roundDecimal(this.calculateMeal(this.state.ground_beef_initial, adjustedGroundBeef, +this.state.ground_beef_this) / groundBeefGperServing),
            }
          }, () => {
            // console.log(this.state.thisMeal);
          });
        });
      });
    });


  }

  firstMeal(obj, prefix) {
    return this.roundDecimal(+obj[prefix + '_initial'] * (+obj[prefix + '_after'] - +obj[prefix + '_eating']) / +obj[prefix + '_after'] || 0);
  }

  calculateMeal(initialVal, adjusted, gramsPerServing) {
    return this.roundDecimal(+initialVal * gramsPerServing / adjusted || 0);
  }

  roundDecimal(number) {
    return Math.round(number*10000) / 10000;
  }

  resetCookies() {
    const cookies = new Cookies();

    for(let i in this.state) {
      if (this.state.hasOwnProperty(i)) {
        cookies.remove(i);
      }
    }
  }

  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <h2>Actions</h2>
          <div className="">
            <button onClick={() => this.resetCookies()}>Reset Cookies</button>
          </div>
        </div>
        <div className="wrapper">
          <h3>Pre cook values</h3>
          <div className="input-wrapper">
            <input type="number" id="penne_initial" className="input-text input-text--small" placeholder="Dry Penne G" defaultValue={this.state.penne_initial} onChange={(event) => this.updateData(event)} />
            <input type="number" id="ground_beef_initial" className="input-text input-text--small" placeholder="Raw Ground Beef LBS" defaultValue={this.roundDecimal(+this.state.ground_beef_initial/453.592)} onChange={(event) => this.updateData(event)} />
          </div>
        </div>
        <div className="wrapper">
          <h3>After cook in grams (just cooked)</h3>
          <div className="input-wrapper">
            <input type="number" id="penne_after" className="input-text input-text--small" placeholder="Wet Penne G" defaultValue={this.state.penne_after} onChange={(event) => this.updateData(event)} />
            <input type="number" id="ground_beef_after" className="input-text input-text--small" placeholder="Ground Beef G" defaultValue={this.state.ground_beef_after} onChange={(event) => this.updateData(event)} />
          </div>
        </div>
        <div className="wrapper">
          <h3>Grams left after eating (just cooked)</h3>
          <div className="input-wrapper">
            <input type="number" id="penne_eating" className="input-text input-text--small" placeholder="Wet Penne G" defaultValue={this.state.penne_eating} onChange={(event) => this.updateData(event)} />
            <input type="number" id="ground_beef_eating" className="input-text input-text--small" placeholder="Ground Beef G" defaultValue={this.state.ground_beef_eating} onChange={(event) => this.updateData(event)} />
          </div>
        </div>
        <div className="wrapper">
          <h3>Grams left after cold, before eating again</h3>
          <div className="input-wrapper">
            <input type="number" id="penne_cold" className="input-text input-text--small" placeholder="Cold Penne G" defaultValue={this.state.penne_cold} onChange={(event) => this.updateData(event)} />
            <input type="number" id="ground_beef_cold" className="input-text input-text--small" placeholder="Cold Ground Beef G" defaultValue={this.state.ground_beef_cold} onChange={(event) => this.updateData(event)} />
          </div>
        </div>
        <div className="wrapper">
          <h3>How many grams you eat this meal?</h3>
          <div className="input-wrapper">
            <input type="number" id="penne_this" className="input-text input-text--small" placeholder="Cold Penne G" defaultValue={this.state.penne_this} onChange={(event) => this.updateData(event)} />
            <input type="number" id="ground_beef_this" className="input-text input-text--small" placeholder="Cold Ground Beef G" defaultValue={this.state.ground_beef_this} onChange={(event) => this.updateData(event)} />
          </div>
        </div>
        <div className="wrapper">
          <h2>Enter for normal meal (150g penne, 100g ground beef)</h2>
          <div className="results" id="result-normal">
            <p>Pasta = { this.state.normalMeal.pasta }</p>
            <p>GB = { this.state.normalMeal.groundBeef }</p>
          </div>
        </div>
        <div className="wrapper">
          <h2>Enter for THIS meal</h2>
          <div className="results" id="result-this">
            <p>Pasta = { this.state.thisMeal.pasta }</p>
            <p>GB = { this.state.thisMeal.groundBeef }</p>
          </div>
        </div>
        <div className="wrapper">
          <h2>FIRST meal</h2>
          <div className="results" id="result-this">
            <p>Pasta = { this.state.firstMeal.pasta }</p>
            <p>GB = { this.state.firstMeal.groundBeef }</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
