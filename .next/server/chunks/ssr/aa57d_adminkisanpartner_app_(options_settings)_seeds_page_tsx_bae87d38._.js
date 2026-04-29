module.exports=[778493,a=>{"use strict";var b=a.i(282814),c=a.i(288216),d=a.i(998050),e=a.i(368860);let f="/api/seeds",g=async(a,b)=>{try{let c=await fetch(a,{headers:{"Content-Type":"application/json"},...b});if(!c.ok){let a=await c.json().catch(()=>({}));throw Error(a.error||`HTTP error! status: ${c.status}`)}return await c.json()}catch(b){throw console.error(`API Error for ${a}:`,b),b}};function h(){let[a,h]=(0,c.useState)([]),[i,j]=(0,c.useState)(""),[k,l]=(0,c.useState)(1),[m,n]=(0,c.useState)(1),[o,p]=(0,c.useState)(0),[q,r]=(0,c.useState)(10),[s,t]=(0,c.useState)(!1),[u,v]=(0,c.useState)(!1),[w,x]=(0,c.useState)(!1),[y,z]=(0,c.useState)(!1),[A,B]=(0,c.useState)(null),[C,D]=(0,c.useState)(""),[E,F]=(0,c.useState)(""),[G,H]=(0,c.useState)("other"),[I,J]=(0,c.useState)([]),[K,L]=(0,c.useState)(!1),[M,N]=(0,c.useState)(new Set),O=[{value:"vegetable",label:"Vegetable"},{value:"fruit",label:"Fruit"},{value:"grain",label:"Grain"},{value:"herb",label:"Herb"},{value:"flower",label:"Flower"},{value:"other",label:"Other"}],P=async()=>{L(!0);try{let a=new URLSearchParams({search:i||"",page:k.toString(),limit:q.toString()}),b=await g(`${f}?${a}`);b.success?(h(b.data),n(b.pagination.pages),p(b.pagination.total)):e.default.error(b.error||"Failed to load seeds")}catch(a){console.error("Error fetching seeds:",a),e.default.error(a.message||"Failed to load seeds")}finally{L(!1)}};(0,c.useEffect)(()=>{P()},[i,k,q]);let Q=async()=>{if(!C.trim())return void e.default.error("Please enter a seed name");L(!0);try{let a={name:C.trim(),description:E.trim()||void 0,category:G},b=await g(f,{method:"POST",body:JSON.stringify(a)});b.success?(e.default.success("Seed added successfully"),x(!1),V(),P()):e.default.error(b.error||"Failed to add seed")}catch(a){console.error("Error adding seed:",a),e.default.error(a.message||"Failed to add seed")}finally{L(!1)}},R=async()=>{if(A&&C.trim()){L(!0);try{let a={name:C.trim(),description:E.trim()||void 0,category:G},b=await g(`${f}/${A._id}`,{method:"PUT",body:JSON.stringify(a)});b.success?(e.default.success("Seed updated successfully"),t(!1),V(),B(null),P()):e.default.error(b.error||"Failed to update seed")}catch(a){console.error("Error updating seed:",a),e.default.error(a.message||"Failed to update seed")}finally{L(!1)}}},S=async()=>{if(A){L(!0);try{let a=await g(`${f}/${A._id}`,{method:"DELETE"});a.success?(e.default.success("Seed deleted successfully"),v(!1),B(null),P()):e.default.error(a.error||"Failed to delete seed")}catch(a){console.error("Error deleting seed:",a),e.default.error(a.message||"Failed to delete seed")}finally{L(!1)}}},T=async()=>{0===I.length?e.default.error("Please select at least one seed to delete"):z(!0)},U=async()=>{L(!0);try{let a=await g(`${f}/bulk`,{method:"POST",body:JSON.stringify({ids:I})});a.success?(e.default.success(a.message||`${I.length} seed(s) deleted successfully`),J([]),z(!1),P()):(e.default.error(a.error||"Failed to delete seeds"),z(!1))}catch(a){console.error("Error deleting selected seeds:",a),e.default.error(a.message||"Failed to delete seeds"),z(!1)}finally{L(!1)}},V=()=>{D(""),F(""),H("other")},W=b=>{b.target.checked?J(a.map(a=>a._id)):J([])},X=a=>{I.includes(a)?J(I.filter(b=>b!==a)):J([...I,a])},Y=async()=>{if(0===a.length)return void e.default.error("No data to copy");let b=a.map(a=>a.name).join(", ");navigator.clipboard.writeText(b),e.default.success("Seed names copied to clipboard!")},Z=()=>{if(0===a.length)return void e.default.error("No data to export");let b=new Blob([["Sr.	Seed Name	Category	Description	Created Date",...a.map((a,b)=>[b+1+(k-1)*q,a.name,a.category||"other",a.description||"",new Date(a.createdAt).toLocaleDateString()].join("	"))].join("\n")],{type:"application/vnd.ms-excel"}),c=URL.createObjectURL(b),d=document.createElement("a");d.href=c,d.download=`seeds-${new Date().toISOString().split("T")[0]}.xls`,d.click(),URL.revokeObjectURL(c),e.default.success("Excel file downloaded successfully!")},$=()=>{if(0===a.length)return void e.default.error("No data to export");let b=new Blob([["Sr.,Seed Name,Category,Description,Created Date",...a.map((a,b)=>[b+1+(k-1)*q,`"${a.name.replace(/"/g,'""')}"`,`"${a.category||"other"}"`,`"${(a.description||"").replace(/"/g,'""')}"`,`"${new Date(a.createdAt).toLocaleDateString()}"`].join(","))].join("\n")],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(b),d=document.createElement("a");d.href=c,d.download=`seeds-${new Date().toISOString().split("T")[0]}.csv`,d.click(),URL.revokeObjectURL(c),e.default.success("CSV file downloaded successfully!")},_=()=>{if(0===a.length)return void e.default.error("No data to export");let b=window.open("","_blank","width=900,height=700");if(!b)return void e.default.error("Please allow popups to export PDF");let c=new Date().toLocaleDateString(),d=new Date().toLocaleTimeString(),f=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Seeds Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #4CAF50;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 24px;
          }
          .header-info {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            border: 1px solid #d1d5db;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .category-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          @media print {
            @page {
              margin: 0.5in;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 Seeds Report</h1>
          <div class="header-info">Generated on: ${c} at ${d}</div>
          <div class="header-info">Total Seeds: ${o} | Showing: ${a.length} seeds</div>
          <div class="header-info">Page: ${k} of ${m}</div>
          ${i?`<div class="header-info">Search filter: "${i}"</div>`:""}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Seed Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${a.map((a,b)=>`
                <tr>
                  <td>${b+1+(k-1)*q}</td>
                  <td><strong>${a.name}</strong></td>
                  <td><span class="category-badge">${a.category||"other"}</span></td>
                  <td>${a.description||"-"}</td>
                  <td>${new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Seeds Management System | ${window.location.hostname}</p>
          <p>\xa9 ${new Date().getFullYear()} All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;b.document.write(f),b.document.close(),b.focus(),e.default.success("PDF export opened - please use browser's print dialog and select 'Save as PDF'")},aa=()=>{if(0===a.length)return void e.default.error("No data to print");let b=window.open("","_blank","width=900,height=700");if(!b)return void e.default.error("Please allow popups to print");let c=new Date().toLocaleDateString(),d=new Date().toLocaleTimeString(),f=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Seeds Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #4CAF50;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 24px;
          }
          .header-info {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            border: 1px solid #d1d5db;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .category-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          @media print {
            @page {
              margin: 0.5in;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 Seeds Report</h1>
          <div class="header-info">Generated on: ${c} at ${d}</div>
          <div class="header-info">Total Seeds: ${o} | Showing: ${a.length} seeds</div>
          <div class="header-info">Page: ${k} of ${m}</div>
          ${i?`<div class="header-info">Search filter: "${i}"</div>`:""}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Seed Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${a.map((a,b)=>`
                <tr>
                  <td>${b+1+(k-1)*q}</td>
                  <td><strong>${a.name}</strong></td>
                  <td><span class="category-badge">${a.category||"other"}</span></td>
                  <td>${a.description||"-"}</td>
                  <td>${new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Seeds Management System | ${window.location.hostname}</p>
          <p>\xa9 ${new Date().getFullYear()} All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;b.document.write(f),b.document.close(),b.focus(),e.default.success("Print window opened!")},ab=a=>{B(a),D(a.name),F(a.description||""),H(a.category||"other"),t(!0)},ac=a=>{B(a),v(!0)},ad=()=>{V(),x(!0)};return(0,b.jsxs)("div",{className:"p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen",children:[K&&(0,b.jsx)("div",{className:"fixed inset-0 bg-black/10 z-50 flex items-center justify-center",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"})}),(0,b.jsxs)("div",{className:"mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl md:text-2xl font-bold text-gray-800",children:"Seeds"}),(0,b.jsxs)("p",{className:"text-gray-600 mt-1",children:["Manage seed varieties for your farm. ",o," seeds found."]})]}),(0,b.jsx)("div",{className:"flex justify-end",children:(0,b.jsxs)("button",{onClick:ad,className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors",children:[(0,b.jsx)(d.FaPlus,{className:"text-sm"}),"Add New Seed"]})})]}),(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow mb-4 border border-gray-200",children:[(0,b.jsxs)("div",{className:"p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)("label",{className:"flex items-center space-x-2 text-sm text-gray-700",children:[(0,b.jsx)("input",{type:"checkbox",checked:I.length===a.length&&a.length>0,onChange:W,className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"}),(0,b.jsx)("span",{children:"Select All"})]}),I.length>0&&(0,b.jsxs)("button",{onClick:T,className:"ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",children:[(0,b.jsx)(d.FaTrash,{className:"text-sm"}),"Delete Selected (",I.length,")"]})]}),(0,b.jsx)("div",{className:"lg:hidden flex flex-wrap gap-2",children:[{label:"Copy",icon:d.FaCopy,onClick:Y,color:"bg-gray-100 hover:bg-gray-200",disabled:0===a.length},{label:"Excel",icon:d.FaFileExcel,onClick:Z,color:"bg-green-100 hover:bg-green-200",disabled:0===a.length},{label:"CSV",icon:d.FaFileCsv,onClick:$,color:"bg-blue-100 hover:bg-blue-200",disabled:0===a.length},{label:"PDF",icon:d.FaFilePdf,onClick:_,color:"bg-red-100 hover:bg-red-200",disabled:0===a.length},{label:"Print",icon:d.FaPrint,onClick:aa,color:"bg-purple-100 hover:bg-purple-200",disabled:0===a.length}].map((a,c)=>(0,b.jsxs)("div",{className:"relative group",title:a.label,children:[(0,b.jsx)("button",{onClick:a.onClick,disabled:a.disabled,className:`p-2 rounded transition-colors ${a.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,b.jsx)(a.icon,{})}),(0,b.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:a.label})]},c))})]}),(0,b.jsxs)("div",{className:"p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200",children:[(0,b.jsxs)("div",{className:"relative max-w-md",children:[(0,b.jsx)(d.FaSearch,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"}),(0,b.jsx)("input",{type:"text",placeholder:"Search seeds...",value:i,onChange:a=>{j(a.target.value),l(1)},className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"})]}),(0,b.jsx)("div",{className:"lg:flex flex-wrap gap-2 hidden",children:[{label:"Copy",icon:d.FaCopy,onClick:Y,color:"bg-gray-100 hover:bg-gray-200",disabled:0===a.length},{label:"Excel",icon:d.FaFileExcel,onClick:Z,color:"bg-green-100 hover:bg-green-200",disabled:0===a.length},{label:"CSV",icon:d.FaFileCsv,onClick:$,color:"bg-blue-100 hover:bg-blue-200",disabled:0===a.length},{label:"PDF",icon:d.FaFilePdf,onClick:_,color:"bg-red-100 hover:bg-red-200",disabled:0===a.length},{label:"Print",icon:d.FaPrint,onClick:aa,color:"bg-purple-100 hover:bg-purple-200",disabled:0===a.length}].map((a,c)=>(0,b.jsxs)("div",{className:"relative group",title:a.label,children:[(0,b.jsx)("button",{onClick:a.onClick,disabled:a.disabled,className:`p-2 rounded transition-colors ${a.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,b.jsx)(a.icon,{})}),(0,b.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:a.label})]},c))})]})]}),(0,b.jsxs)("div",{className:"hidden lg:block bg-white rounded-lg shadow overflow-hidden border border-gray-200",children:[(0,b.jsx)("div",{className:"overflow-x-auto",children:(0,b.jsxs)("table",{className:"min-w-full divide-y divide-gray-200",children:[(0,b.jsx)("thead",{className:"bg-gray-50",children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{className:"w-12 px-4 py-3",children:(0,b.jsx)("input",{type:"checkbox",checked:I.length===a.length&&a.length>0,onChange:W,className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"})}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Sr."}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Seed Name"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Category"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Created Date"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Actions"})]})}),(0,b.jsx)("tbody",{className:"bg-white divide-y divide-gray-200",children:a.map((a,c)=>(0,b.jsxs)("tr",{className:"hover:bg-gray-50 transition-colors",children:[(0,b.jsx)("td",{className:"px-4 py-3",children:(0,b.jsx)("input",{type:"checkbox",checked:I.includes(a._id),onChange:()=>X(a._id),className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"})}),(0,b.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:c+1+(k-1)*q}),(0,b.jsxs)("td",{className:"px-4 py-3 text-sm text-gray-900",children:[(0,b.jsxs)("div",{className:"font-medium flex items-center gap-2",children:[(0,b.jsx)(d.FaSeedling,{className:"text-green-500 text-sm"}),a.name]}),a.description&&(0,b.jsx)("div",{className:"text-xs text-gray-500 mt-1",children:a.description})]}),(0,b.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:(0,b.jsx)("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",children:a.category||"other"})}),(0,b.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:(0,b.jsx)("div",{className:"text-xs text-gray-500",children:new Date(a.createdAt).toLocaleDateString()})}),(0,b.jsx)("td",{className:"px-4 py-3 text-sm",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)("div",{className:"relative group",children:[(0,b.jsx)("button",{onClick:()=>ab(a),className:"text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors border border-blue-200",title:"Edit",children:(0,b.jsx)(d.FaEdit,{})}),(0,b.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:"Edit"})]}),(0,b.jsxs)("div",{className:"relative group",children:[(0,b.jsx)("button",{onClick:()=>ac(a),className:"text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors border border-red-200",title:"Delete",children:(0,b.jsx)(d.FaTrash,{})}),(0,b.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:"Delete"})]})]})})]},a._id))})]})}),0===a.length&&!K&&(0,b.jsxs)("div",{className:"text-center py-12",children:[(0,b.jsx)("div",{className:"text-gray-400 text-5xl mb-4",children:"🌱"}),(0,b.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No seeds found"}),(0,b.jsx)("p",{className:"text-gray-500 mb-4",children:i?`No results for "${i}". Try a different search.`:"Add your first seed to get started."}),(0,b.jsxs)("button",{onClick:ad,className:"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto",children:[(0,b.jsx)(d.FaPlus,{className:"text-lg"}),"Add New Seed"]})]}),a.length>0&&(0,b.jsxs)("div",{className:"border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsxs)("div",{className:"text-sm text-gray-700",children:["Showing ",(0,b.jsx)("span",{className:"font-semibold",children:1+(k-1)*q})," to"," ",(0,b.jsx)("span",{className:"font-semibold",children:Math.min(k*q,o)})," of"," ",(0,b.jsx)("span",{className:"font-semibold",children:o})," entries"]}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsxs)("select",{value:q,onChange:a=>{r(Number(a.target.value)),l(1)},className:"pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white",children:[(0,b.jsx)("option",{value:10,children:"10 rows"}),(0,b.jsx)("option",{value:25,children:"25 rows"}),(0,b.jsx)("option",{value:50,children:"50 rows"}),(0,b.jsx)("option",{value:100,children:"100 rows"})]}),(0,b.jsx)("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700",children:(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})})]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsxs)("button",{onClick:()=>l(1),disabled:1===k,className:"p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,b.jsx)("span",{className:"sr-only",children:"First"}),(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M11 19l-7-7 7-7m8 14l-7-7 7-7"})})]}),(0,b.jsx)("button",{onClick:()=>l(Math.max(1,k-1)),disabled:1===k,className:"px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Previous"}),Array.from({length:Math.min(5,m)},(a,c)=>{let d;return d=m<=5||k<=3?c+1:k>=m-2?m-4+c:k-2+c,(0,b.jsx)("button",{onClick:()=>l(d),className:`px-3 py-1 rounded ${k===d?"bg-blue-600 text-white":"border border-gray-300 hover:bg-gray-50"}`,children:d},c)}),(0,b.jsx)("button",{onClick:()=>l(Math.min(m,k+1)),disabled:k===m,className:"px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Next"}),(0,b.jsxs)("button",{onClick:()=>l(m),disabled:k===m,className:"p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,b.jsx)("span",{className:"sr-only",children:"Last"}),(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M13 5l7 7-7 7M5 5l7 7-7 7"})})]})]})]})]}),(0,b.jsxs)("div",{className:"lg:hidden space-y-4",children:[a.map((a,c)=>{let e,f;return(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow border border-gray-200 overflow-hidden",children:[(0,b.jsx)("div",{className:"p-4 border-b border-gray-100",children:(0,b.jsxs)("div",{className:"flex items-start justify-between",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("input",{type:"checkbox",checked:I.includes(a._id),onChange:()=>X(a._id),className:"h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"}),(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(d.FaSeedling,{className:"text-green-500"}),(0,b.jsx)("h3",{className:"font-semibold text-gray-900",children:a.name})]}),(0,b.jsxs)("div",{className:"flex items-center gap-2 mt-1",children:[(0,b.jsxs)("span",{className:`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${((a="other")=>{let b={vegetable:"bg-green-100 text-green-800",fruit:"bg-red-100 text-red-800",grain:"bg-yellow-100 text-yellow-800",herb:"bg-purple-100 text-purple-800",flower:"bg-pink-100 text-pink-800",other:"bg-gray-100 text-gray-800"};return b[a]||b.other})(a.category)}`,children:[(0,b.jsx)(d.FaTag,{className:"mr-1"}),a.category||"other"]}),(0,b.jsxs)("span",{className:"text-xs text-gray-500",children:["#",c+1+(k-1)*q]})]})]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsx)("button",{onClick:()=>ab(a),className:"text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors",title:"Edit",children:(0,b.jsx)(d.FaEdit,{className:"text-sm"})}),(0,b.jsx)("button",{onClick:()=>ac(a),className:"text-red-600 hover:bg-red-50 p-2 rounded transition-colors",title:"Delete",children:(0,b.jsx)(d.FaTrash,{className:"text-sm"})}),(0,b.jsx)("button",{onClick:()=>{var b;let c;return b=a._id,c=new Set(M),void(M.has(b)?c.delete(b):c.add(b),N(c))},className:"text-gray-500 hover:bg-gray-100 p-2 rounded transition-colors",children:(e=a._id,M.has(e))?(0,b.jsx)(d.FaChevronUp,{}):(0,b.jsx)(d.FaChevronDown,{})})]})]})}),(0,b.jsxs)("div",{className:"p-4",children:[(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-3 mb-3",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"text-xs text-gray-500 flex items-center gap-1",children:[(0,b.jsx)(d.FaCalendarAlt,{className:"text-gray-400"}),"Created"]}),(0,b.jsx)("div",{className:"text-sm font-medium",children:new Date(a.createdAt).toLocaleDateString()})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-xs text-gray-500",children:"Last Updated"}),(0,b.jsx)("div",{className:"text-sm",children:new Date(a.updatedAt).toLocaleDateString()})]})]}),a.description&&(0,b.jsxs)("div",{className:"mt-2",children:[(0,b.jsxs)("div",{className:"text-xs text-gray-500 flex items-center gap-1 mb-1",children:[(0,b.jsx)(d.FaInfoCircle,{className:"text-gray-400"}),"Description"]}),(0,b.jsx)("p",{className:"text-sm text-gray-700 line-clamp-2",children:a.description})]})]}),(f=a._id,M.has(f)&&(0,b.jsx)("div",{className:"px-4 pb-4 border-t border-gray-100 pt-3",children:(0,b.jsxs)("div",{className:"space-y-3",children:[!a.description&&(0,b.jsx)("div",{className:"text-sm text-gray-500 italic",children:"No description provided"}),(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-xs text-gray-500",children:"Record ID"}),(0,b.jsx)("div",{className:"text-xs font-mono text-gray-700 truncate",children:a._id})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-xs text-gray-500",children:"Full Category"}),(0,b.jsx)("div",{className:"text-sm font-medium capitalize",children:a.category||"other"})]})]}),(0,b.jsxs)("div",{className:"flex justify-between pt-3 border-t border-gray-100",children:[(0,b.jsxs)("div",{className:"text-xs text-gray-500",children:["Created: ",new Date(a.createdAt).toLocaleString()]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)("button",{onClick:()=>ab(a),className:"text-xs text-blue-600 hover:text-blue-800 font-medium",children:"Edit"}),(0,b.jsx)("button",{onClick:()=>ac(a),className:"text-xs text-red-600 hover:text-red-800 font-medium",children:"Delete"})]})]})]})}))]},a._id)}),0===a.length&&!K&&(0,b.jsxs)("div",{className:"text-center py-12 bg-white rounded-lg shadow border border-gray-200",children:[(0,b.jsx)("div",{className:"text-gray-400 text-5xl mb-4",children:"🌱"}),(0,b.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No seeds found"}),(0,b.jsx)("p",{className:"text-gray-500 mb-4",children:i?`No results for "${i}". Try a different search.`:"Add your first seed to get started."}),(0,b.jsxs)("button",{onClick:ad,className:"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto",children:[(0,b.jsx)(d.FaPlus,{className:"text-lg"}),"Add New Seed"]})]}),a.length>0&&(0,b.jsx)("div",{className:"bg-white rounded-lg shadow border border-gray-200 p-4 mt-4",children:(0,b.jsxs)("div",{className:"flex flex-col space-y-4",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{className:"text-sm text-gray-700",children:["Showing ",1+(k-1)*q," to ",Math.min(k*q,o)," of ",o]}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsxs)("select",{value:q,onChange:a=>{r(Number(a.target.value)),l(1)},className:"pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white",children:[(0,b.jsx)("option",{value:10,children:"10 rows"}),(0,b.jsx)("option",{value:25,children:"25 rows"}),(0,b.jsx)("option",{value:50,children:"50 rows"})]}),(0,b.jsx)("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700",children:(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})})]})]}),(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("button",{onClick:()=>l(Math.max(1,k-1)),disabled:1===k,className:"px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:[(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M15 19l-7-7 7-7"})}),"Previous"]}),(0,b.jsx)("div",{className:"flex items-center gap-1",children:Array.from({length:Math.min(3,m)},(a,c)=>{let d;return d=m<=3||1===k?c+1:k===m?m-2+c:k-1+c,(0,b.jsx)("button",{onClick:()=>l(d),className:`px-3 py-1 text-sm rounded ${k===d?"bg-blue-600 text-white":"border border-gray-300 hover:bg-gray-50"}`,children:d},c)})}),(0,b.jsxs)("button",{onClick:()=>l(Math.min(m,k+1)),disabled:k===m,className:"px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:["Next",(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 5l7 7-7 7"})})]})]}),(0,b.jsxs)("div",{className:"text-center text-xs text-gray-500",children:["Page ",k," of ",m]})]})})]}),(0,b.jsx)("div",{className:`fixed inset-0 z-50 ${w?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,b.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-lg",children:(0,b.jsxs)("div",{className:"p-6",children:[(0,b.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Add New Seed"}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Seed Name *"}),(0,b.jsx)("input",{type:"text",value:C,onChange:a=>D(a.target.value),placeholder:"e.g., 618, NAMI TOMATO, ULLAS TOMATO",disabled:K,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Enter the seed variety name"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Description"}),(0,b.jsx)("textarea",{value:E,onChange:a=>F(a.target.value),placeholder:"Optional description for the seed",disabled:K,rows:3,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Category"}),(0,b.jsx)("select",{value:G,onChange:a=>H(a.target.value),disabled:K,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50",children:O.map(a=>(0,b.jsx)("option",{value:a.value,children:a.label},a.value))})]})]}),(0,b.jsxs)("div",{className:"flex justify-end gap-2 mt-6",children:[(0,b.jsx)("button",{onClick:()=>x(!1),disabled:K,className:"px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50",children:"Cancel"}),(0,b.jsx)("button",{onClick:Q,disabled:!C.trim()||K,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:K?"Adding...":"Add Seed"})]})]})})}),(0,b.jsx)("div",{className:`fixed inset-0 z-50 ${s?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,b.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-lg",children:(0,b.jsxs)("div",{className:"p-6",children:[(0,b.jsxs)("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:["Edit Seed: ",A?.name]}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Seed Name *"}),(0,b.jsx)("input",{type:"text",value:C,onChange:a=>D(a.target.value),disabled:K,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Description"}),(0,b.jsx)("textarea",{value:E,onChange:a=>F(a.target.value),disabled:K,rows:3,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Category"}),(0,b.jsx)("select",{value:G,onChange:a=>H(a.target.value),disabled:K,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50",children:O.map(a=>(0,b.jsx)("option",{value:a.value,children:a.label},a.value))})]})]}),(0,b.jsxs)("div",{className:"flex justify-end gap-2 mt-6",children:[(0,b.jsx)("button",{onClick:()=>t(!1),disabled:K,className:"px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50",children:"Cancel"}),(0,b.jsx)("button",{onClick:R,disabled:!C.trim()||K,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:K?"Saving...":"Save Changes"})]})]})})}),(0,b.jsx)("div",{className:`fixed inset-0 z-50 ${u?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,b.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-md",children:(0,b.jsxs)("div",{className:"p-6 text-center",children:[(0,b.jsx)("div",{className:"text-red-500 text-5xl mb-4",children:"🗑️"}),(0,b.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Delete Seed?"}),(0,b.jsxs)("p",{className:"text-gray-600 mb-6",children:['Are you sure you want to delete "',A?.name,'"? This action cannot be undone.']}),(0,b.jsxs)("div",{className:"flex justify-center gap-3",children:[(0,b.jsx)("button",{onClick:()=>v(!1),disabled:K,className:"px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50",children:"Cancel"}),(0,b.jsx)("button",{onClick:S,disabled:K,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50",children:K?"Deleting...":"Delete"})]})]})})}),(0,b.jsx)("div",{className:`fixed inset-0 z-50 ${y?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,b.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-md",children:(0,b.jsxs)("div",{className:"p-6 text-center",children:[(0,b.jsx)("div",{className:"text-red-500 text-5xl mb-4",children:"🗑️"}),(0,b.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Delete Selected Seeds?"}),(0,b.jsxs)("p",{className:"text-gray-600 mb-6",children:["Are you sure you want to delete ",I.length," selected seed(s)? This action cannot be undone."]}),(0,b.jsxs)("div",{className:"flex justify-center gap-3",children:[(0,b.jsx)("button",{onClick:()=>z(!1),disabled:K,className:"px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50",children:"Cancel"}),(0,b.jsx)("button",{onClick:U,disabled:K,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50",children:K?"Deleting...":`Delete ${I.length} Seeds`})]})]})})})]})}a.s(["default",()=>h])}];

//# sourceMappingURL=aa57d_adminkisanpartner_app_%28options_settings%29_seeds_page_tsx_bae87d38._.js.map