import express from 'express';
import http from 'http';

const port = 3000;
const app = express();
const httpServer = http.createServer(app);

const Jobs = {};

app.post('/submit', (req, res) => {
  const jobId = `Job:${Date.now()}`;
  Jobs[jobId] = 0;
  updateJob(jobId, 0);
  res.end('\n\n' + jobId + '\n\n');
});

app.get('/checkstatus', async (req, res) => {
  console.log(Jobs[req.query.jobId]);
  //long polling, don't respond until done
  while ((await checkJobComplete(req.query.jobId)) == false);
  res.end('\n\nJobStatus: Complete ' + Jobs[req.query.jobId] + '%\n\n');
});

async function checkJobComplete(jobId) {
  return new Promise((resolve, reject) => {
    if (Jobs[jobId] < 100) this.setTimeout(() => resolve(false), 1000);
    else resolve(true);
  });
}

function updateJob(jobId, prg) {
  Jobs[jobId] = prg;
  console.log(`updated ${jobId} to ${prg}`);
  if (prg == 100) return;
  setTimeout(() => updateJob(jobId, prg + 10), 10000);
}

httpServer.listen(port, () => {
  console.log('server running on port 3000');
});
