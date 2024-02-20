const videoUrl = 'https://www.youtube.com/watch?v=MoN9ql6Yymw&list=PLRUeMuoAjPeAEAPYC6wOWTkto-fXC5GRh&index=2'
const ytdl = require('ytdl-core')
const fs = require('fs')
const { exec } = require('child_process')

// Replace 'VIDEO_URL' with the actual YouTube video URL
// const videoUrl = 'VIDEO_URL';

// Configure download options
const options = {
  filter: 'audioonly', // Download audio only
  quality: 'highestaudio', // Choose the highest quality audio
}

// Download video stream
const videoStream = ytdl(videoUrl, options)

// Handle video stream events
videoStream.on('info', (info) => {
  console.log('Download started')
  console.log(`Video Title: ${info.videoDetails.title}`)
  console.log(`Video Duration: ${info.videoDetails.lengthSeconds} seconds`)
})

videoStream.on('progress', (_, downloaded, total) => {
  const progress = (downloaded / total) * 100
  process.stdout.write(`\rDownloading ${progress.toFixed(2)}%`)
})

videoStream.on('end', () => {
  console.log('\nDownload completed')

  // Convert video to MP3 using ffmpeg
  const inputPath = 'video.mp4' // Input video file
  const outputPath = 'output.mp3' // Output MP3 file

  const command = `ffmpeg -i ${inputPath} -q:a 0 -map a ${outputPath}`

  exec(command, (error) => {
    if (error) {
      console.error('Error during conversion:', error)
    } else {
      console.log('Conversion finished')
      fs.unlinkSync(inputPath) // Remove the temporary video file
    }
  })
})

// Save video stream to a file
videoStream.pipe(fs.createWriteStream('video.mp4'))

// import ffmpegPath from '@ffmpeg-installer/ffmpeg'
// import ffmpeg from 'fluent-ffmpeg'
// import { Readable } from 'stream';
// ffmpeg.setFfmpegPath(ffmpegPath.path)
// const inputFilePath = ''
// const outputFilePath = fs.createWriteStream(path.resolve(__dirname, './output.mp3'))
// const response = await axios.get(inputFilePath, { responseType: 'arraybuffer' });
//
// const readable = new Readable();
// readable._read = () => {};
// readable.push(response.data);
// readable.push(null)
//
// ffmpeg(readable)
//   .toFormat('mp3')
//   .on('end', () => {
//     console.log('Conversion finished');
//   })
//   .on('error', (err) => {
//     console.error('Error:', err);
//     res.status(500).send('Internal Server Error');
//   })
//   .pipe(outputFilePath, { end: true });


