"# performanceTestingProject" 

**Background**

This project is about demonstrating the performance testing tool K6 with two custom express servers. 

I initially started testing server.js and found that under increased load and duration with minor sleep times it caused flaws in the database, ie duplicated write requests were being made and this caused database corruption. Note that at this stage I was simply using a data.json file as my database. 

As such I researched a variety of means to resolve this, experimenting with options such as mutex and optimistic concurrency, but ultimately these didn't mitigate the problem as much as was hoped. It was however a useful learning experience as it highlighted the drawbacks of using a simple data.json file as the means of storing data and instead using a database, in this instance sqlite3. 

In the end the sqlite3 database was able to load tests which broke the data.json file and had 100% of tests passing.

**Instalation**

Clone down the repo.
If not installed already, install k6 globally using the following command: 'npm install -g k6'.
Navigate to the 'expressServerForPerformanceTesting' directory and execute 'npm install'.

**Testing**

To run comparative tests I suggest doing the following:

Firstly whilst in 'expressServerForPerformanceTesting' run the following command: 'node server.js'.
Keep an eye on the data.json file in this directory whilst running the next command.
In another tab navigate to 'k6Tests' and run the following command: 'k6 run load-test.js'.

In this instance the load will likely cause some form of crash with not all tests being executed correctly and possibly even data corruption in the data.json file (duplicated write commands).

For the second test do the following:

Ensure you stop the first server from running, then whilst in 'expressServerForPerformanceTesting' run the following command: 'node serverDb.js'.
In another tab navigate to 'k6Tests' and run the following command: 'k6 run load-test.js'.

Notice now that there should be a complete test pass.
