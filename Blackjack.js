/*
    111550024 蔡芳慈 第4次作業 11/17
    111550024 Fangci Tsai The Fourth Homework 11/17
*/
let cards = new Array(208);
let suits = ['club', 'diamond', 'heart', 'spade'];
let isDouble = [0];
let isInsurance = [0];
let isSurrender = [0];
let originalbet = 0;
let areacount = 1;
let action = 0;
let dealerhaveace = 0;
let playerhaveace = [0];
let nowcardarea;
let dealerback;
let changebet= 200;
const gamedata = {
    round: 0,
    playercardnum: [],
    playercards: [],
    playerpoints: [],
    dealercardnum: [],
    dealercards: [],
    dealerpoints: [],
    chips: [],
    gameresult: [],
    remainchips: 0
};
// 加音效&音效開關
window.addEventListener('load', () => {
    let savedinlocal = localStorage.getItem('storegamedata');
    let savedinsession = sessionStorage.getItem('storegamedata');
    let resulttable= document.getElementById('resulttable');
    if(savedinsession) {
        Object.assign(gamedata, JSON.parse(savedinsession));
        document.getElementById('chipamount').innerHTML = gamedata.remainchips;
        if(gamedata.remainchips <= 0) {
            localStorage.removeItem('storegamedata');
            sessionStorage.removeItem('storegamedata');
            document.reload();
        }
        else{
            for(let i=0; i<gamedata.round; i++) {
                let tr= document.createElement('tr');
                tr.innerHTML= '<td>' + (i+1) + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.playercardnum[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.playercards[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.playerpoints[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.dealercardnum[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.dealercards[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.dealerpoints[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.chips[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.gameresult[i] + '</td>\n';
                resulttable.appendChild(tr);
            }
            changebet= parseInt(document.getElementById('chipamount').innerHTML);
        }
    }
    else if (savedinlocal) {
        Object.assign(gamedata, JSON.parse(savedinlocal));
        document.getElementById('chipamount').innerHTML = gamedata.remainchips;
        if(gamedata.remainchips <= 0) {
            localStorage.removeItem('storegamedata');
            sessionStorage.removeItem('storegamedata');
            document.reload();
        }
        else {
            for(let i=0; i<gamedata.round; i++) {
                let tr= document.createElement('tr');
                tr.innerHTML= '<td>' + (i+1) + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.playercardnum[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.playercards[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.playerpoints[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.dealercardnum[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.dealercards[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.dealerpoints[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.chips[i] + '</td>\n';
                tr.innerHTML+= '<td>' + gamedata.gameresult[i] + '</td>\n';
                resulttable.appendChild(tr);
            }
            changebet= parseInt(document.getElementById('chipamount').innerHTML);
        }
    }
});
function RandomCard(cardarea) {
    while(true) {
        let card = Math.floor(Math.random() * 207);
        //let card = Math.floor(Math.random() * 15)* 13;
        if(cards[card]== 0) {
            cards[card]= 1;
            let suit= suits[Math.floor(card/13%4)];
            let value= card%13+1;
            let cardname= suit + value;
            let cardimg= document.createElement('img');
            cardimg.src= 'image/' + cardname + '.jpg';
            cardimg.id= cardname;
            cardarea.appendChild(cardimg);
            let vlauename= cardarea.id + 'value';
            if(value > 10) {
                value= 10;
            }
            if(value == 1) {
                value= 11;
                if(cardarea.id == 'cardarea0') {
                    dealerhaveace++;
                }
                else {
                    playerhaveace[cardarea.id.slice(-1)]++;
                }
            }
            document.getElementById('sound').currentTime= 0;
            document.getElementById('sound').play();
            setTimeout(() => {
                document.getElementById('sound').pause();
            }, 900);
            let changevalue= document.getElementById(vlauename);
            setTimeout(() => {
                if(changevalue.innerHTML == '') {
                    changevalue.innerHTML= value;
                }
                else {
                    changevalue.innerHTML= parseInt(changevalue.innerHTML) + value;
                }
                if(parseInt(document.getElementById(vlauename).innerHTML) > 21 && cardarea.id== 'cardarea0' && dealerhaveace>= 1) {
                    document.getElementById(vlauename).innerHTML-= 10;
                    dealerhaveace--;
                }
                if(parseInt(document.getElementById(vlauename).innerHTML) > 21 && cardarea.id!= 'cardarea0' && playerhaveace[cardarea.id.slice(8)]>= 1) {
                    document.getElementById(vlauename).innerHTML-= 10;
                    playerhaveace[cardarea.id.slice(8)]--;
                }
            }, 1000);
            break;
        }
    }
}
function checkSplit(cardarea) {
    let card= cardarea.getElementsByTagName('img');
    let split= document.getElementById('split');
    let card1= parseInt(card[0].id.slice(-1));
    let card2= parseInt(card[1].id.slice(-1));
    if(!isNaN(parseInt(card[0].id.slice(-2)))){
        card1= parseInt(card[0].id.slice(-2));
        if(card1> 10) {
            card1= 10;
        }
    }
    if(!isNaN(parseInt(card[1].id.slice(-2)))){
        card2= parseInt(card[1].id.slice(-2));
        if(card2> 10) {
            card2= 10;
        }
    }
    if (parseInt(card1) == parseInt(card2)) {
        split.style.filter= 'brightness(100%)';
        split.disabled= false;
    }
    else {
        split.style.filter= 'brightness(50%)';
        split.disabled= true;
    }
}
function AssignCards() {
    for(let i=0; i<208; i++) {
        cards[i] = 0;
    }
    let back= document.createElement('img');
    back.src= 'image/back.jpg';
    back.id= 'back';
    document.getElementById('cardarea0').appendChild(back);
    RandomCard(document.getElementById('cardarea0'));
    setTimeout(() => {
        RandomCard(document.getElementById('cardarea1'));
    }, 1100);
    setTimeout(() => {
        RandomCard(document.getElementById('cardarea1'));
    }, 2200);
    setTimeout(() => {
        let decisions= document.getElementById('decisions');
        decisions.style.display= 'block';
        decisions.querySelectorAll('button').forEach(button => {
            button.disabled= false;
            button.style.filter= 'brightness(100%)';
        });
        checkSplit(document.getElementById('cardarea1'));
        CheckDecision();
        if(parseInt(document.getElementById('cardarea1value').innerHTML) == 21) {
            Stand(document.getElementById('cardarea1'));
        }
    }, 3300);
}
function CheckBank() {
    const chipValues = [5, 20, 50, 100];
    chipValues.forEach(value => {
        let chip = document.getElementById(`chip${value}`);
        if (parseInt(document.getElementById('chipamount').innerHTML) < value) {
            chip.disabled = true;
            chip.style.filter = 'brightness(50%)';
        } else {
            chip.disabled = false;
            chip.style.filter = 'brightness(100%)';
        }
    });
    let chip5= document.getElementById('chip5');
    if(parseInt(document.getElementById('chipamount').innerHTML) >= 20 || parseInt(document.getElementById('chipamount').innerHTML) == 0) {
        chip5.style.display= 'none';
    }
    else {
        chip5.style.display= 'inline-block';
    }
}
function CheckDecision() {
    let chipamount= document.getElementById('chipamount');
    let split= document.getElementById('split');
    let double= document.getElementById('double');
    let insurance= document.getElementById('insurance');
    let surrender= document.getElementById('surrender');
    let cardarea0value= document.getElementById('cardarea0value').innerHTML;
    if(action== 0) {
        if(parseInt(chipamount.innerHTML) < originalbet) {
            double.disabled= true;
            double.style.filter= 'brightness(50%)';
        }
        else {
            double.disabled= false;
            double.style.filter= 'brightness(100%)';
        }
        if(Number.isInteger(parseInt(chipamount.innerHTML)- originalbet / 2)==0 || cardarea0value != 11 || parseInt(chipamount.innerHTML)< originalbet / 2) {
            insurance.disabled= true;
            insurance.style.filter= 'brightness(50%)';
        }
        else {
            insurance.disabled= false;
            insurance.style.filter= 'brightness(100%)';
        }
        if(chipamount.innerHTML < originalbet) {
            split.disabled= true;
            split.style.filter= 'brightness(50%)';
        }
        surrender.disabled= false;
        surrender.style.filter= 'brightness(100%)';
    }
    else {
        split.disabled= true;
        split.style.filter= 'brightness(50%)';
        double.disabled= true;
        double.style.filter= 'brightness(50%)';
        insurance.disabled= true;
        insurance.style.filter= 'brightness(50%)';
        surrender.disabled= true;
        surrender.style.filter= 'brightness(50%)';
    }
}
function CheckBust(i) {
    let cardareas= document.getElementsByClassName('cardarea');
    let chipamount= document.getElementById('chipamount');
    let cardarea0value= parseInt(document.getElementById('cardarea0value').innerHTML);
    let cardareavalue= document.getElementById(cardareas[i].id + 'value');
    let value = parseInt((cardareavalue).innerHTML);
    let cardamount= cardareas[i].getElementsByTagName('img').length;
    let dealercardamount= cardareas[0].getElementsByTagName('img').length;
    let resulttable= document.getElementById('resulttable');
    let rownum= resulttable.rows.length-1;
    resulttable.rows[rownum].cells[3].innerHTML+= value;
    let ichipamount= originalbet
    if(isDouble[i] == 1) {
        ichipamount*= 2;
    }
    if(isInsurance[i] == 1) ichipamount= ichipamount + " + Insurance";
    resulttable.rows[rownum].cells[7].innerHTML= ichipamount;
    if(isSurrender[i] == 1) {
        cardareavalue.innerHTML+= '<br>Surrender';
        resulttable.rows[rownum].cells[8].innerHTML+= 'Surrender';
    }
    else if(value > 21) { //bust
        cardareavalue.innerHTML+= '<br>Bust';
        resulttable.rows[rownum].cells[8].innerHTML+= 'Bust';
    }
    else if(value==21 && cardamount==2 && cardarea0value==21 && dealercardamount!=2) { //blackjack
        let punishment= originalbet;
        if(isDouble[i] == 1) {
            punishment*= 2;
        }
        chipamount.innerHTML= parseInt(chipamount.innerHTML) + punishment * 2.5;
        chipamount.innerHTML = Math.round(parseFloat(chipamount.innerHTML) * 2.5 / 5) * 5;
        cardareavalue.innerHTML += '<br>Blackjack';
        resulttable.rows[rownum].cells[8].innerHTML+= 'Blackjack'; 
    }
    else if(value==21 && cardamount!=2 && cardarea0value==21 && dealercardamount==2) { //lose
        cardareavalue.innerHTML+= '<br>Lose';
        resulttable.rows[rownum].cells[8].innerHTML+= 'Lose';
    }
    else if(value ==cardarea0value || (value>21 && cardarea0value>21)) { //push
        let punishment= originalbet;
        if(isDouble[i] == 1) {
            punishment*= 2;
        }
        chipamount.innerHTML= parseInt(chipamount.innerHTML) + punishment;
        cardareavalue.innerHTML+= '<br>Push';
        resulttable.rows[rownum].cells[8].innerHTML+= 'Push';
    }
    else if(value == 21 && cardamount==2) { //blackjack
        let punishment= originalbet;
        if(isDouble[i] == 1) {
            punishment*= 2;
        }
        chipamount.innerHTML= parseInt(chipamount.innerHTML) + punishment * 2.5;
        chipamount.innerHTML = Math.round(parseFloat(chipamount.innerHTML) * 2.5 / 5) * 5;
        cardareavalue.innerHTML+= '<br>Blackjack';
        resulttable.rows[rownum].cells[8].innerHTML+= 'Blackjack';
    }
    else if(cardarea0value> 21 || value > cardarea0value) { //dealer bust or win
        let punishment= originalbet;
        if(isDouble[i] == 1) {
            punishment*= 2;
        }
        chipamount.innerHTML= parseInt(chipamount.innerHTML) + punishment * 2;
        cardareavalue.innerHTML+= '<br>Win';
        resulttable.rows[rownum].cells[8].innerHTML+= 'Win';
    }
    else if(value < cardarea0value) { //lose
        cardareavalue.innerHTML+= '<br>Lose';
        resulttable.rows[rownum].cells[8].innerHTML+= 'Lose';
    }
    if(isInsurance[i] == 1 && cardarea0value== 21 && dealercardamount== 2) {
        chipamount.innerHTML= parseInt(chipamount.innerHTML) + originalbet * 1.5;
    }
    resulttable.rows[rownum].cells[1].innerHTML+= cardamount;
    let playercards= '';
    cardareas[i].querySelectorAll('img').forEach(card => {
        playercards+= card.id + ' ';
    });
    resulttable.rows[rownum].cells[2].innerHTML+= playercards;
    if(i!= areacount) {
        resulttable.rows[rownum].cells[1].innerHTML+= '<br>';
        resulttable.rows[rownum].cells[2].innerHTML+= '<br>';
        resulttable.rows[rownum].cells[3].innerHTML+= '<br>';
        resulttable.rows[rownum].cells[7].innerHTML+= '<br>';
        resulttable.rows[rownum].cells[8].innerHTML+= '<br>';
    }
}
let backcardid;
function UpdateDealer() {
    let back= document.getElementById('back');
    let cardarea0value= document.getElementById('cardarea0value');
    while(dealerback) {
        let backcard= Math.floor(Math.random() * 207);
        //let backcard= Math.floor(Math.random() * 15)* 13;
        if(cards[backcard]== 0) {
            cards[backcard]= 1;
            dealerback= 0;
            let suit= suits[Math.floor(backcard/13%4)];
            let value= backcard%13+1;
            let cardname= suit + value;
            backcardid= cardname;
            setTimeout(() => {
                back.src= 'image/' + cardname + '.jpg';
                if(value > 10) {
                    value= 10;
                }
                if(value == 1 && parseInt(cardarea0value.innerHTML) + 11 <= 21) {
                    value= 11;
                    dealerhaveace= 1;
                }
                cardarea0value.innerHTML= parseInt(cardarea0value.innerHTML) + value;
                document.getElementById('sound').currentTime= 0;
                document.getElementById('sound').play();
            }, 500);
            break;
        }
    }
    setTimeout(() => {
        if(parseInt(cardarea0value.innerHTML)< 17) {
            RandomCard(document.getElementById('cardarea0'));
            setTimeout(() => {
                UpdateDealer();
            }, 1100);
        }
        else {
            let decisions= document.getElementById('decisions');
            decisions.style.display= 'none';
            for(let i=1; i<=areacount; i++) {
                setTimeout(() => {
                    let cardarea= document.getElementById('cardarea' + i);
                    cardarea.style.filter= 'brightness(100%)';
                    CheckBust(i);
                    setTimeout(() => {
                        if(i != areacount) {
                            cardarea.style.filter= 'brightness(50%)';
                        }
                    }, 1000);
                }, 1500*(i-1));
            }
            setTimeout(() => {
                document.getElementById('bank').style.position= 'relative';
                let resulttable= document.getElementById('resulttable');
                let rownum= resulttable.rows.length-1;
                resulttable.rows[rownum].cells[0].innerHTML= rownum;
                resulttable.rows[rownum].cells[4].innerHTML= document.getElementById('cardarea0').getElementsByTagName('img').length;
                let dealercards= '';
                document.getElementById('cardarea0').querySelectorAll('img').forEach(card => {
                    if(card.id == 'back') {
                        dealercards+= backcardid + ' ';
                    }
                    else dealercards+= card.id + ' ';
                });
                resulttable.rows[rownum].cells[5].innerHTML= dealercards;
                resulttable.rows[rownum].cells[6].innerHTML= document.getElementById('cardarea0value').innerHTML;

                gamedata.round++;
                gamedata.playercardnum.push(resulttable.rows[rownum].cells[1].innerHTML);
                gamedata.playercards.push(resulttable.rows[rownum].cells[2].innerHTML);
                gamedata.playerpoints.push(resulttable.rows[rownum].cells[3].innerHTML);
                gamedata.dealercardnum.push(resulttable.rows[rownum].cells[4].innerHTML);
                gamedata.dealercards.push(resulttable.rows[rownum].cells[5].innerHTML);
                gamedata.dealerpoints.push(resulttable.rows[rownum].cells[6].innerHTML);
                gamedata.chips.push(resulttable.rows[rownum].cells[7].innerHTML);
                gamedata.gameresult.push(resulttable.rows[rownum].cells[8].innerHTML);
                gamedata.remainchips= parseInt(document.getElementById('chipamount').innerHTML);
                localStorage.setItem('storegamedata', JSON.stringify(gamedata));
                sessionStorage.setItem('storegamedata', JSON.stringify(gamedata));

                document.getElementById('result').style.display= 'block';
                document.getElementById('resulttext').style.display= 'block';
                let cardarea= document.querySelectorAll('.cardarea');
                let chiparea= document.querySelectorAll('.chiparea');
                cardarea.forEach(card => {
                    card.style.filter= 'brightness(100%)';
                });
                changebet= parseInt(document.getElementById('chipamount').innerHTML) - changebet;
                document.getElementById('resulttext').innerHTML= changebet > 0 ? 'You win ' + changebet + ' chips!' : changebet < 0 ? 'You lose ' + Math.abs(changebet) + ' chips!' : 'You push!';
                if(parseInt(document.getElementById('chipamount').innerHTML) <= 0) {
                    document.getElementById('resulttext').innerHTML= 'You are out of chips. Game Over!';
                    document.getElementById('restart').style.display= 'inline-block';
                }
                else {
                    document.getElementById('nextround').style.display= 'inline-block';
                }
                document.getElementById('nextround').addEventListener('click', () => {
                    for(let i=2; i<cardarea.length; i++) {
                        cardarea[i].remove();
                        chiparea[i-1].remove();
                    }
                    cardarea[0].querySelectorAll('img').forEach(card => {
                        card.remove();
                    });
                    cardarea[1].querySelectorAll('img').forEach(card => {
                        card.remove();
                    });
                    chiparea[0].querySelectorAll('img').forEach(chip => {
                        chip.remove();
                    });
                    let playerarea= document.querySelectorAll('.playerarea');
                    for(let i=1; i<playerarea.length; i++) {
                        playerarea[i].remove();
                    }
                    document.getElementById('cardarea0value').innerHTML= '';
                    document.getElementById('cardarea1value').innerHTML= '';
                    document.getElementById('betamount').innerHTML= 0;
                    document.getElementById('resulttext').style.display= 'none';
                    document.getElementById('bank').style.position= 'fixed';
                });
            }, 1500*areacount);
        }
    }, 1500);
}
function Stand(cardarea) {
    if(areacount == cardarea.id.slice(8)) { // last cardarea
        let decisions= document.getElementById('decisions');
        decisions.querySelectorAll('button').forEach(button => {
            button.disabled= true;
            button.style.filter= 'brightness(50%)';
        });
        cardarea.style.filter= 'brightness(50%)';
        UpdateDealer();
    }
    else { // still have not stand cardarea
        cardarea.style.filter= 'brightness(50%)';
        let nextarea= 'cardarea' + (parseInt(cardarea.id.slice(8))+1);
        document.getElementById(nextarea).style.filter= 'brightness(100%)';
        action= 0;
        CheckDecision();
        nowcardarea= document.getElementById(nextarea);
    }
}
function Hit(cardarea) {
    RandomCard(cardarea);
    let decisions= document.getElementById('decisions');
    decisions.querySelectorAll('button').forEach(button => {
        button.disabled= true;
        button.style.filter= 'brightness(50%)';
    });
    setTimeout(() => {
        decisions.querySelectorAll('button').forEach(button => {
            button.disabled= false;
            button.style.filter= 'brightness(100%)';
        });
        let value= parseInt(document.getElementById(cardarea.id + 'value').innerHTML);
        if(value >= 21) {
            Stand(cardarea);
        }
        action= 1;
        CheckDecision();
    }, 1500);
}
function Split(cardarea) {
    areacount++;
    isDouble[areacount] = 0;
    isInsurance[areacount]= 0;
    isSurrender[areacount]= 0;
    playerhaveace[areacount]= 0;
    let player= document.getElementById('player');
    let newplayerarea= document.createElement('div');
    newplayerarea.className= 'playerarea';
    player.appendChild(newplayerarea);
    let splitareaname= 'cardarea' + areacount;
    let splitarea= document.createElement('div')
    splitarea.id= splitareaname;
    splitarea.className= 'cardarea';
    newplayerarea.appendChild(splitarea);

    let originalcard= cardarea.getElementsByTagName('img');
    let value= parseInt(originalcard[0].id.slice(-1));
    if(!isNaN(parseInt(originalcard[0].id.slice(-2)))){
        value= parseInt(originalcard[0].id.slice(-2));
        if(value> 10) {
            value= 10;
        }
    }
    if(value == 1) {
        value= 11;
        playerhaveace[cardarea.id.slice(8)]= 1;
        playerhaveace[areacount]= 1;
        document.getElementById(cardarea.id + 'value').innerHTML= 11;
    }
    document.getElementById(cardarea.id + 'value').innerHTML= value;
    let splitvaluename= 'cardarea' + areacount + 'value';
    let splitvalue= document.createElement('p');
    splitvalue.id= splitvaluename;
    splitvalue.innerHTML= value;
    splitarea.appendChild(splitvalue);

    let splitchiparea= document.createElement('div');
    splitchiparea.id= 'chiparea' + areacount;
    splitchiparea.className= 'chiparea';
    newplayerarea.appendChild(splitchiparea);
    let chipareaname= 'chiparea'+ cardarea.id.slice(8);
    let chiparea= document.getElementById(chipareaname);
    let chips= chiparea.getElementsByTagName('img');
    for(let i=0; i<chips.length; i++) {
        let chip= document.createElement('img');
        chip.src= chips[i].src;
        chip.className= 'assignedchip';
        splitchiparea.appendChild(chip);
    }

    let betamount= document.getElementById('betamount');
    let chipamount= document.getElementById('chipamount');
    betamount.innerHTML= parseInt(betamount.innerHTML) + originalbet;
    chipamount.innerHTML= parseInt(chipamount.innerHTML) - originalbet;

    let card= cardarea.getElementsByTagName('img');
    splitarea.appendChild(card[1]);

    let decisions= document.getElementById('decisions');
    decisions.querySelectorAll('button').forEach(button => {
        button.disabled= true;
        button.style.filter= 'brightness(50%)';
    });
    setTimeout(() => {
        RandomCard(cardarea);
        RandomCard(splitarea);
        checkSplit(cardarea);
    }, 500);
    setTimeout(() => {
        splitarea.style.filter= 'brightness(50%)';
        decisions.querySelectorAll('button').forEach(button => {
            button.disabled= false;
            button.style.filter= 'brightness(100%)';
        });
        CheckDecision();
        if(parseInt(document.getElementById(cardarea.id + 'value').innerHTML) == 21) {
            Stand(cardarea);
        }
    }, 1800);
}
function Double(cardarea) {
    let decisions= document.getElementById('decisions');
    decisions.querySelectorAll('button').forEach(button => {
        button.disabled= true;
        button.style.filter= 'brightness(50%)';
    });
    isDouble[cardarea.id.slice(8)]= 1;
    let betamount= document.getElementById('betamount');
    let chipamount= document.getElementById('chipamount');
    chipamount.innerHTML= parseInt(chipamount.innerHTML) - originalbet;
    betamount.innerHTML= parseInt(betamount.innerHTML) + originalbet;
    RandomCard(cardarea);
    setTimeout(() => {
        decisions.querySelectorAll('button').forEach(button => {
            button.disabled= false;
            button.style.filter= 'brightness(100%)';
        });
        Stand(cardarea);
    }, 1500);
}
function Insurance(cardarea) {
    isInsurance[cardarea.id.slice(8)]= 1;
    let betamount= document.getElementById('betamount');
    let chipamount= document.getElementById('chipamount');
    chipamount.innerHTML= parseInt(chipamount.innerHTML) - originalbet / 2;
    betamount.innerHTML= parseInt(betamount.innerHTML) + originalbet / 2;
    let insurance= document.getElementById('insurance');
    insurance.disabled= true;
    insurance.style.filter= 'brightness(50%)';
}
function Surrender(cardarea) {
    isSurrender[cardarea.id.slice(8)]= 1;
    let betamount= document.getElementById('betamount');
    let chipamount= document.getElementById('chipamount');
    betamount.innerHTML= parseInt(betamount.innerHTML) - originalbet / 2;
    chipamount.innerHTML= parseInt(chipamount.innerHTML) + originalbet / 2;
    Stand(cardarea);
}
document.querySelectorAll('.chip').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('deal').style.display= 'block';
        let chiparea1= document.getElementById('chiparea1');
        let chipvalue = parseInt(button.id.slice(4));
        let chip= document.createElement('img');
        chip.src= 'image/' + button.id + '.png';
        chip.className= 'assignedchip';
        chip.alt= button.id;
        chiparea1.appendChild(chip);
        document.getElementById('betamount').innerHTML= parseInt(document.getElementById('betamount').innerHTML) + chipvalue;
        document.getElementById('chipamount').innerHTML= parseInt(document.getElementById('chipamount').innerHTML) - chipvalue;
        CheckBank();
    });
});
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('assignedchip')) {
        if(document.getElementById('bankchips').style.display != 'none') {
            let chip = event.target;
            let chipvalue = parseInt(chip.alt.slice(4));
            document.getElementById('betamount').innerHTML= parseInt(document.getElementById('betamount').innerHTML) - chipvalue;
            document.getElementById('chipamount').innerHTML= parseInt(document.getElementById('chipamount').innerHTML) + chipvalue;
            chip.remove();
            CheckBank();
            if(parseInt(document.getElementById('betamount').innerHTML) == 0) {
                document.getElementById('deal').style.display= 'none';
            }
        }
    }
});
let deal= document.getElementById('deal');
let bankchips= document.getElementById('bankchips');
let instructions= document.getElementById('instructions');
let dealer= document.getElementById('dealer');
let nextround= document.getElementById('nextround');
deal.addEventListener('click', () => {
    document.getElementById('bgm').play();
    deal.style.display= 'none';
    bankchips.style.display= 'none';
    dealer.style.display= 'flex';
    instructions.style.display= 'none';
    nextround.style.display= 'none';
    document.querySelectorAll('.assignedchip').forEach(chip => {
        chip.disabled= true;
    });
    nowcardarea= document.getElementById('cardarea1');
    areacount= 1;
    action= 0;
    dealerhaveace= 0;
    dealerback= 1;
    isDouble = [0, 0];
    isInsurance = [0, 0];
    isSurrender = [0, 0];
    playerhaveace = [0, 0];
    originalbet= parseInt(document.getElementById('betamount').innerHTML);
    document.getElementById('resulttext').innerHTML= '';
    AssignCards();
    setTimeout(() => {
        CheckDecision();
        if(parseInt(document.getElementById('cardarea1value').innerHTML) == 21) {
            Stand(nowcardarea);
        }
    }, 1100);
    //resulttable
    let resulttable= document.getElementById('resulttable');
    let tr= document.createElement('tr');
    tr.innerHTML= '<td id="round"></td>\n';
    tr.innerHTML+= '<td id="playercardnum"></td>\n';
    tr.innerHTML+= '<td id="playercards"></td>\n';
    tr.innerHTML+= '<td id="playerpoints"></td>\n';
    tr.innerHTML+= '<td id="dealercardnum"></td>\n';
    tr.innerHTML+= '<td id="dealercards"></td>\n';
    tr.innerHTML+= '<td id="dealerpoints"></td>\n';
    tr.innerHTML+= '<td id="chips"></td>\n';
    tr.innerHTML+= '<td id="gameresult"></td>\n';
    resulttable.appendChild(tr);
});
nextround.addEventListener('click', () => {
    CheckBank();
    bankchips.style.display= 'block';
    dealer.style.display= 'none';
    instructions.style.display= 'block';
    let result= document.getElementById('result');
    result.style.display= 'none';
    cards.fill(0);
    isDouble.fill(0);
    isInsurance.fill(0);
    isSurrender.fill(0);
    playerhaveace.fill(0);
    changebet= parseInt(document.getElementById('chipamount').innerHTML);
});
let restart= document.getElementById('restart');
restart.addEventListener('click', () => {
    localStorage.removeItem('storegamedata');
    sessionStorage.removeItem('storegamedata');
    location.reload(); // refresh the page
});
document.getElementById('hit').addEventListener('click', () => {
    Hit(nowcardarea);
});
document.getElementById('stand').addEventListener('click', () => {
    Stand(nowcardarea);
});
document.getElementById('split').addEventListener('click', () => {
    Split(nowcardarea);
});
document.getElementById('double').addEventListener('click', () => {
    Double(nowcardarea);
});
document.getElementById('insurance').addEventListener('click', () => {
    Insurance(nowcardarea);
});
document.getElementById('surrender').addEventListener('click', () => {
    Surrender(nowcardarea);
});
const neonColumn = document.getElementsByClassName('neon-column');
const colors = ['pink', 'blue', 'yellow'];
for (let i = 0; i < 19; i++) {
    const newLight = document.createElement('div');
    newLight.className = `neon-circle ${colors[i % colors.length]}`;
    const newLight2 = document.createElement('div');
    newLight2.className = `neon-circle ${colors[(i+1) % colors.length]}`;
    neonColumn[0].appendChild(newLight);
    neonColumn[1].appendChild(newLight2);
}
const switchElement = document.getElementById('toggleSwitch');
switchElement.addEventListener('click', () => {
    if(switchElement.classList.contains('active')) {
        document.getElementById('bgm').muted= true;
        document.getElementById('toggleSwitch').style.backgroundColor= '#d3d3d3';
    }
    else {
        document.getElementById('bgm').muted= false;
        document.getElementById('toggleSwitch').style.backgroundColor= '#BC4B51';
    }
    switchElement.classList.toggle('active');
});
const soundElement = document.getElementById('toggleSwitch2');
soundElement.addEventListener('click', () => {
    if(soundElement.classList.contains('active')) {
        document.getElementById('sound').muted= true;
        document.getElementById('toggleSwitch2').style.backgroundColor= '#d3d3d3';
    }
    else {
        document.getElementById('sound').muted= false;
        document.getElementById('toggleSwitch2').style.backgroundColor= '#BC4B51';
    }
    soundElement.classList.toggle('active');
});
document.getElementById('OK').addEventListener('click', () => {
    document.getElementById('guide').style.display= 'none';
});