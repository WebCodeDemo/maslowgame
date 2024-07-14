
        const needs = {
            physiological: { value: 100, weight: 5, name: "Physiological" },
            safety: { value: 80, weight: 4, name: "Safety" },
            love: { value: 60, weight: 3, name: "Love/Belonging" },
            esteem: { value: 40, weight: 2, name: "Esteem" },
            actualization: { value: 20, weight: 1, name: "Self-Actualization" }
        };

        let money = 100;
        let fame = 0;
        let health = 100;
        let fitness = 50;
        let lastAction = '';
        let statusEffects = [];
        let day = 1;

        function updateNeeds() {
            const needLevels = {
                'physiological': document.querySelector('#physiological .need-fill'),
                'safety': document.querySelector('#safety .need-fill'),
                'love': document.querySelector('#love-belonging .need-fill'),
                'esteem': document.querySelector('#esteem .need-fill'),
                'actualization': document.querySelector('#self-actualization .need-fill')
            };

            for (let need in needs) {
                if (needLevels[need]) {
                    needLevels[need].style.width = `${needs[need].value}%`;
            
                    // Update the label to include the value
                    const label = document.querySelector(`#${need} .need-label`);
                    label.textContent = `${needs[need].name}: ${needs[need].value.toFixed(1)}`;
                }
            }
        }

        function updateDisplay() {
            updateNeeds()
            document.getElementById('money-value').textContent = money;
            document.getElementById('money-fill').style.width = (money / 10) + '%';
            document.getElementById('fame-value').textContent = fame;
            document.getElementById('fame-fill').style.width = fame + '%';
            document.getElementById('health-value').textContent = health.toFixed(1);
            document.getElementById('health-fill').style.width = health + '%';
            document.getElementById('fitness-value').textContent = fitness.toFixed(1);
            document.getElementById('fitness-fill').style.width = fitness + '%';
            updateScore();
        }

        function performAction(action) {
            lastAction = action;
            switch(action) {
                case 'eat':
                    if (money >= 10) {
                        health = Math.min(100, health + 5);
                        money -= 10;
                    } else {
                        document.getElementById('message').textContent = "Not enough money to eat!";
                        return;
                    }
                    break;
                case 'sleep':
                    needs.safety.value = Math.min(100, needs.safety.value + 10);
                    health = Math.min(100, health + 10);
                    day++;
                    break;
                case 'exercise':
                    if (money >= 5) {
                        let fitnessGain = Math.min(10, 100 - fitness);
                        fitness += fitnessGain;
                        needs.esteem.value = Math.min(100, needs.esteem.value + 15);
                        money -= 5;
                        health = Math.min(100, health + 5);
                    } else {
                        document.getElementById('message').textContent = "Not enough money to exercise!";
                        return;
                    }
                    break;
                case 'work':
                    needs.safety.value = Math.min(100, needs.safety.value + 20);
                    needs.esteem.value = Math.min(100, needs.esteem.value + 10);
                    money += 50;
                    fitness = Math.max(0, fitness - 2);
                    break;
                case 'socialize':
                    if (money >= 20) {
                        needs.love.value = Math.min(100, needs.love.value + 20);
                        needs.esteem.value = Math.min(100, needs.esteem.value + 10);
                        money -= 20;
                        fame = Math.min(100, fame + 5);
                    } else {
                        document.getElementById('message').textContent = "Not enough money to socialize!";
                        return;
                    }
                    break;
                case 'learn':
                    if (money >= 30) {
                        needs.actualization.value = Math.min(100, needs.actualization.value + 15);
                        needs.esteem.value = Math.min(100, needs.esteem.value + 10);
                        money -= 30;
                    } else {
                        document.getElementById('message').textContent = "Not enough money to learn!";
                        return;
                    }
                    break;
                case 'create':
                    needs.actualization.value = Math.min(100, needs.actualization.value + 20);
                    needs.esteem.value = Math.min(100, needs.esteem.value + 15);
                    fame = Math.min(100, fame + 10);
                    fitness = Math.max(0, fitness - 5);
                    break;
                case 'performShow':
                    if (money >= 50) {
                        needs.esteem.value = Math.min(100, needs.esteem.value + 25);
                        needs.actualization.value = Math.min(100, needs.actualization.value + 15);
                        money -= 50;
                        fame = Math.min(100, fame + 20);
                        let earnings = Math.floor(fame * 5);
                        money += earnings;
                        fitness = Math.max(0, fitness - 10);
                        document.getElementById('message').textContent = `You earned $${earnings} from your performance!`;
                    } else {
                        document.getElementById('message').textContent = "Not enough money to perform a show!";
                        return;
                    }
                    break;
                case 'seeDoctor':
                    if (money >= 100) {
                        health = Math.min(100, health + 30);
                        money -= 100;
                    } else {
                        document.getElementById('message').textContent = "Not enough money to see the doctor!";
                        return;
                    }
                    break;
            }

            // Decrease all needs slightly each turn
            for (let need in needs) {
                if (need !== 'physiological') {
                    needs[need].value = Math.max(0, needs[need].value - 2);
                }
            }

            // Health and fitness natural decrease
            health = Math.max(0, health - 1);
            fitness = Math.max(0, fitness - 1);

            // Update physiological need based on health and fitness
            needs.physiological.value = (health + fitness) / 2;

            applyRandomStatusEffects();
            updateDisplay();
            checkGameState();
        }

        function applyRandomStatusEffects() {
            statusEffects = [];
            
            // Complex random events
            if (Math.random() < 0.05) {
                let event = complexRandomEvents[Math.floor(Math.random() * complexRandomEvents.length)];
                statusEffects.push(event.message);
                event.effect();
            }

            // Health and fitness specific events
            if (Math.random() < 0.1) {
                let event = healthFitnessEvents[Math.floor(Math.random() * healthFitnessEvents.length)];
                statusEffects.push(event.message);
                event.effect();
            }

            // Action-specific events
            switch(lastAction) {
                case 'eat':
                    if (Math.random() < 0.1) {
                        statusEffects.push("The food was contaminated. Health decreased.");
                        health = Math.max(0, health - 20);
                    }
                    break;
                case 'sleep':
                    if (Math.random() < 0.2) {
                        statusEffects.push("You had a rejuvenating sleep. All needs slightly increased.");
                        for (let need in needs) {
                            needs[need].value = Math.min(100, needs[need].value + 5);
                        }
                    }
                    break;
                case 'work':
                    if (Math.random() < 0.1) {
                        statusEffects.push("You got a promotion! Money and Esteem increased.");
                        money += 200;
                        needs.esteem.value = Math.min(100, needs.esteem.value + 20);
                    }
                    break;
            }

            // Display status effects
            document.getElementById('status-effects').innerHTML = statusEffects.map(effect => `<p>${effect}</p>`).join('');
        }

        const complexRandomEvents = [
            {
                message: "You won a local lottery! Money increased significantly.",
                effect: () => { money += 500; }
            },
            {
                message: "A natural disaster occurred. Safety needs decreased.",
                effect: () => { needs.safety.value = Math.max(0, needs.safety.value - 30); }
            },
            {
                message: "You made a new close friend. Love/Belonging increased.",
                effect: () => { needs.love.value = Math.min(100, needs.love.value + 25); }
            },
            {
                message: "You received recognition for your work. Fame and Esteem increased.",
                effect: () => { 
                    fame = Math.min(100, fame + 15);
                    needs.esteem.value = Math.min(100, needs.esteem.value + 20);
                }
            }
        ];

        const healthFitnessEvents = [
            {
                message: "You caught a cold. Health decreased.",
                effect: () => { health = Math.max(0, health - 15); }
            },
            {
                message: "You discovered a new healthy recipe. Health and Fitness slightly increased.",
                effect: () => {
                    health = Math.min(100, health + 5);
                    fitness = Math.min(100, fitness + 5);
                }
            },
            {
                message: "You joined a local sports team. Fitness increased.",
                effect: () => { fitness = Math.min(100, fitness + 15); }
            },
            {
                message: "You had a minor injury. Fitness decreased.",
                effect: () => { fitness = Math.max(0, fitness - 10); }
            },
            {
                message: "You learned about proper nutrition. Health increased.",
                effect: () => { health = Math.min(100, health + 10); }
            }
        ];

        function updateScore() {
            let totalScore = 0;
            for (let need in needs) {
                totalScore += needs[need].value * needs[need].weight;
            }
            
            let maxScore = 1500; // (100 * 5) + (100 * 4) + (100 * 3) + (100 * 2) + (100 * 1)
            let percentage = (totalScore / maxScore) * 100;
            
            let adjective;
            if (percentage >= 90) adjective = "Thriving";
            else if (percentage >= 80) adjective = "Flourishing";
            else if (percentage >= 70) adjective = "Balanced";
            else if (percentage >= 60) adjective = "Coping";
            else if (percentage >= 50) adjective = "Struggling";
            else if (percentage >= 40) adjective = "Surviving";
            else if (percentage >= 30) adjective = "Floundering";
            else if (percentage >= 20) adjective = "Faltering";
            else if (percentage >= 10) adjective = "Failing";
            else adjective = "Critical";

            document.getElementById('score-display').innerHTML = `
                <p>Day: ${day}</p>
                <p>Total Score: ${totalScore.toFixed(1)} / ${maxScore}</p>
                <p>Life Status: ${adjective}</p>
            `;
        }

        function checkGameState() {
            if (needs.actualization.value >= 100) {
                document.getElementById('message').textContent = "Congratulations! You've reached self-actualization!";
            } else if (needs.physiological.value <= 0 || health <= 0) {
                document.getElementById('message').textContent = "Game Over! You've neglected your basic needs or health.";
            }
        }

        updateDisplay();
