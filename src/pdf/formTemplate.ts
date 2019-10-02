const template = `<!doctype html>
<html lang="en">
<style type="text/css" media="print">
      div.page
      {
        page-break-after: always;
        page-break-inside: avoid;
      }
</style>
 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
 <link rel="stylesheet" href="https://unpkg.com/formiojs@4.0.0-rc.27/dist/formio.full.min.css"
        integrity="sha384-qCmHtp5QGqc3DEUNAdcjETwaX3+JYREeRcBOEKW98JTIDWe3VZD9xBlaYc1/gmWZ" crossorigin="anonymous">
   <script src="https://unpkg.com/formiojs@4.2.8/dist/formio.full.js"
    integrity="sha384-oO8VpIg5Lz/nw2AjEeeu/KfV5PyGn3lhKfjBLMz/E358Sq7FI9Hmmec9tyyUowEs"
   crossorigin="anonymous"></script>

</script>
    <script type='text/javascript'>
      window.onload = function() {
      Formio.plugins = [{
        priority: 0,
        preRequest: async function (requestArgs) {
            if (!requestArgs.opts) {
                requestArgs.opts = {};
            }
            if (!requestArgs.opts.header) {
                requestArgs.opts.header = new Headers();
                if (requestArgs.method !== 'upload') {
                    requestArgs.opts.header.set('Accept', 'application/json');
                    requestArgs.opts.header.set('Content-type', 'application/json; charset=UTF-8');
                } else {
                    requestArgs.opts.header.set('Content-type', requestArgs.file.type);
                }
            }
            requestArgs.opts.header.set('Authorization', 'Bearer <%= token %>');
            if (!requestArgs.url) {
                requestArgs.url = "";
            }
            requestArgs.url = requestArgs.url.replace("_id", "id");
            return requestArgs;
        },
    },

        {
            priority: 0,
            requestResponse: function (response) {
                return {
                    ok: response.ok,
                    json: () => response.json().then((result) => {
                        if (result.forms) {
                            return result.forms.map((form) => {
                                form['_id'] = form.id;
                                return form;
                            });
                        }
                        result['_id'] = result.id;
                        return result;
                    }),
                    status: response.status,
                    headers: response.headers
                };

            }
        }]

       Formio.createForm(document.getElementById('formio'),  <%- JSON.stringify(formSchema) %>, {
            readOnly: true
       }).then(function(form) {
           form.submission =  <%- JSON.stringify(submission) %>
        });
      };
    </script>
  </head>
  <body>
    <div id='formio'></div>
  </body>
</html>`;

export default template;
