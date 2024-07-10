import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 30, 
    duration: '10s',
};

function performanceTestGetAllBeverages() {
    let res = http.get('http://localhost:3000/beverages');
    check(res, {
        'GET all status was 200': (r) => r.status === 200,
        'GET all response time was < 500ms': (r) => r.timings.duration < 500,
    })
}

function performanceTestGetOneBeverage(id) {
    let res = http.get(`http://localhost:3000/beverages/${id}`);
    check(res, {
        'GET one status was 200': (r) => r.status === 200,
        'GET one response time was < 500ms': (r) => r.timings.duration < 500,
    });
}

function performanceTestCreateBeverage(name, rating) {
    let payload = JSON.stringify({ name: name, rating: rating });
    let res = http.post('http://localhost:3000/beverages', payload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
        'POST status was 201': (r) => r.status === 201,
        'POST response time was < 500ms': (r) => r.timings.duration < 500,
    });
    return res.json().id; 
}

function performanceTestUpdateBeverage(id, name, rating) {
    let payload = JSON.stringify({ name: name, rating: rating });
    let res = http.put(`http://localhost:3000/beverages/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
        'PUT status was 200': (r) => r.status === 200,
        'PUT response time was < 500ms': (r) => r.timings.duration < 500,
    });
}

function performanceTestPatchBeverage(id, rating) {
    let payload = JSON.stringify({ rating: rating });
    let res = http.patch(`http://localhost:3000/beverages/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
        'PATCH status was 200': (r) => r.status === 200,
        'PATCH response time was < 500ms': (r) => r.timings.duration < 500,
    });
}

function performanceTestDeleteBeverage(id) {
    let res = http.del(`http://localhost:3000/beverages/${id}`);
    check(res, {
        'DELETE status was 204': (r) => r.status === 204,
        'DELETE response time was < 500ms': (r) => r.timings.duration < 500,
    });
}

let sleepTime = 0.5

export default function () {
    performanceTestGetAllBeverages();
    sleep(sleepTime)

    let newBeverageId = performanceTestCreateBeverage(`Beverage`, 5);
    sleep(sleepTime)

    performanceTestGetOneBeverage(newBeverageId);
    sleep(sleepTime)

    performanceTestUpdateBeverage(newBeverageId, `Updated Beverage`, 10);
    sleep(sleepTime)

    performanceTestPatchBeverage(newBeverageId, 8);
    sleep(sleepTime)

    performanceTestDeleteBeverage(newBeverageId);
    sleep(sleepTime)
}