const rng = new lab.util.Random()

var trialTemplate = new lab.flow.Sequence({
  content: [
    new lab.html.Screen({
      title: "TOJ Experiment",
      contentUrl: 'trials.html',
      timeout: 1000,
    }),
    new lab.html.Screen({
      title: "TOJ Experiment",
      contentUrl: 'trials.html',
      messageHandlers: {
         'before:prepare': function(){
          trialTemplate.options.parameters.order = rng.shuffle(['hidden', 'visible'])
          this.options.parameters.visibility_left = trialTemplate.options.parameters.order[0],
          this.options.parameters.visibility_right = trialTemplate.options.parameters.order[1]
         }
       },
      timeout: 100
    }),
    new lab.html.Screen({
      tardy: true,
      title: "TOJ Experiment",
      contentUrl: 'trials.html',
      messageHandlers: {
        'before:prepare': function(){
          this.options.timeout = rng.range(300, 800)
          console.log(this.options.timeout)
        },
       }
    }),
    new lab.html.Screen({
      title: "TOJ Experiment",
      contentUrl: 'trials.html',
      messageHandlers: {
        'before:prepare': function(){
          this.options.parameters.visibility_left = trialTemplate.options.parameters.order[1],
          this.options.parameters.visibility_right = trialTemplate.options.parameters.order[0]
        }
      },
      timeout: 100
    }),
    new lab.html.Screen({
      title: "TOJ Experiment",
      contentUrl: 'trials.html',
      responses: {
        'click .left_circle_half': 'left',
        'click .right_circle_half': 'right',
      },
      da: new lab.data.Store(),
      messageHandlers: {
        'prepare': function() {
          // Set the correct response
          // before the component is prepared
          this.options.correctResponse = (trialTemplate.options.parameters.order[0]=='hidden' ? 'left' : 'right')
        }
      }
    }),
    // new lab.html.Screen({
    //     contentUrl: "feedback.html",
    //     responses: {
    //       'keypress(Space)': 'continue'
    //     },
    //     datacommit: false,
    //     // Because feedback can only be given after
    //     // the choice has been recorded, this component
    //     // is prepared at the last possible moment.
    //     tardy: true,
    //     messageHandlers: {
    //       'before:prepare': function() {
    //         if (this.aggregateParameters.feedback) {
    //           // Generate feedback if requested
    //           this.options.timeout = 1000
    //           if (this.options.datastore.state['correct'] === true) {
    //             this.options.parameters.word = 'Well done!'
    //           } else {
    //             this.options.parameters.word = 'Try again and You will catch it!'
    //           }
    //         }
    //       }
    //     },
    // })
  ],
  
})

const trials = [
  { color_left: 'red', color_right: 'green'},
  { color_left: 'green', color_right: 'red'},
]


// Define the sequence of components that define the study
var study = new lab.flow.Sequence({
  content: [
    new lab.html.Screen({
      contentUrl: 'welcome.html',
      responses: {
        'click button.instructions': 'continue'
      }
    }),
    new lab.html.Screen({
      contentUrl: 'summary.html',
      responses: {
        'keypress(Space)': 'continue'
      }
    }),
    new lab.flow.Loop({
      debug: false,
      template: trialTemplate,
      templateParameters: trials,
      shuffle: true,
      sample: {
        n: 3
      }
    }),
    new lab.html.Screen({
      contentUrl: 'thanks.html',
      // Respond to clicks on the download button
      events: {
        'click button#download': function() {
          this.options.datastore.download()
        },
      },
    }),
  ],
  datastore: new lab.data.Store()
})

// Start the study
study.run()
