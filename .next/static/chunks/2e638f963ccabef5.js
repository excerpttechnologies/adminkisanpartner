(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,241121,e=>{"use strict";var t=e.i(475100),s=e.i(442775),r=e.i(521601),a=e.i(22656);let l="/api/seeds",d=async(e,t)=>{try{let s=await fetch(e,{headers:{"Content-Type":"application/json"},...t});if(!s.ok){let e=await s.json().catch(()=>({}));throw Error(e.error||`HTTP error! status: ${s.status}`)}return await s.json()}catch(t){throw console.error(`API Error for ${e}:`,t),t}};function o(){let[e,o]=(0,s.useState)([]),[i,n]=(0,s.useState)(""),[c,x]=(0,s.useState)(1),[h,g]=(0,s.useState)(1),[p,m]=(0,s.useState)(0),[b,u]=(0,s.useState)(10),[f,y]=(0,s.useState)(!1),[v,j]=(0,s.useState)(!1),[w,N]=(0,s.useState)(!1),[k,C]=(0,s.useState)(!1),[S,$]=(0,s.useState)(null),[D,F]=(0,s.useState)(""),[L,A]=(0,s.useState)(""),[P,T]=(0,s.useState)("other"),[E,M]=(0,s.useState)([]),[O,z]=(0,s.useState)(!1),[R,U]=(0,s.useState)(new Set),_=[{value:"vegetable",label:"Vegetable"},{value:"fruit",label:"Fruit"},{value:"grain",label:"Grain"},{value:"herb",label:"Herb"},{value:"flower",label:"Flower"},{value:"other",label:"Other"}],B=async()=>{z(!0);try{let e=new URLSearchParams({search:i||"",page:c.toString(),limit:b.toString()}),t=await d(`${l}?${e}`);t.success?(o(t.data),g(t.pagination.pages),m(t.pagination.total)):a.default.error(t.error||"Failed to load seeds")}catch(e){console.error("Error fetching seeds:",e),a.default.error(e.message||"Failed to load seeds")}finally{z(!1)}};(0,s.useEffect)(()=>{B()},[i,c,b]);let I=async()=>{if(!D.trim())return void a.default.error("Please enter a seed name");z(!0);try{let e={name:D.trim(),description:L.trim()||void 0,category:P},t=await d(l,{method:"POST",body:JSON.stringify(e)});t.success?(a.default.success("Seed added successfully"),N(!1),J(),B()):a.default.error(t.error||"Failed to add seed")}catch(e){console.error("Error adding seed:",e),a.default.error(e.message||"Failed to add seed")}finally{z(!1)}},W=async()=>{if(S&&D.trim()){z(!0);try{let e={name:D.trim(),description:L.trim()||void 0,category:P},t=await d(`${l}/${S._id}`,{method:"PUT",body:JSON.stringify(e)});t.success?(a.default.success("Seed updated successfully"),y(!1),J(),$(null),B()):a.default.error(t.error||"Failed to update seed")}catch(e){console.error("Error updating seed:",e),a.default.error(e.message||"Failed to update seed")}finally{z(!1)}}},V=async()=>{if(S){z(!0);try{let e=await d(`${l}/${S._id}`,{method:"DELETE"});e.success?(a.default.success("Seed deleted successfully"),j(!1),$(null),B()):a.default.error(e.error||"Failed to delete seed")}catch(e){console.error("Error deleting seed:",e),a.default.error(e.message||"Failed to delete seed")}finally{z(!1)}}},Y=async()=>{0===E.length?a.default.error("Please select at least one seed to delete"):C(!0)},G=async()=>{z(!0);try{let e=await d(`${l}/bulk`,{method:"POST",body:JSON.stringify({ids:E})});e.success?(a.default.success(e.message||`${E.length} seed(s) deleted successfully`),M([]),C(!1),B()):(a.default.error(e.error||"Failed to delete seeds"),C(!1))}catch(e){console.error("Error deleting selected seeds:",e),a.default.error(e.message||"Failed to delete seeds"),C(!1)}finally{z(!1)}},J=()=>{F(""),A(""),T("other")},H=t=>{t.target.checked?M(e.map(e=>e._id)):M([])},K=e=>{E.includes(e)?M(E.filter(t=>t!==e)):M([...E,e])},q=async()=>{if(0===e.length)return void a.default.error("No data to copy");let t=e.map(e=>e.name).join(", ");navigator.clipboard.writeText(t),a.default.success("Seed names copied to clipboard!")},Q=()=>{if(0===e.length)return void a.default.error("No data to export");let t=new Blob([["Sr.	Seed Name	Category	Description	Created Date",...e.map((e,t)=>[t+1+(c-1)*b,e.name,e.category||"other",e.description||"",new Date(e.createdAt).toLocaleDateString()].join("	"))].join("\n")],{type:"application/vnd.ms-excel"}),s=URL.createObjectURL(t),r=document.createElement("a");r.href=s,r.download=`seeds-${new Date().toISOString().split("T")[0]}.xls`,r.click(),URL.revokeObjectURL(s),a.default.success("Excel file downloaded successfully!")},X=()=>{if(0===e.length)return void a.default.error("No data to export");let t=new Blob([["Sr.,Seed Name,Category,Description,Created Date",...e.map((e,t)=>[t+1+(c-1)*b,`"${e.name.replace(/"/g,'""')}"`,`"${e.category||"other"}"`,`"${(e.description||"").replace(/"/g,'""')}"`,`"${new Date(e.createdAt).toLocaleDateString()}"`].join(","))].join("\n")],{type:"text/csv;charset=utf-8;"}),s=URL.createObjectURL(t),r=document.createElement("a");r.href=s,r.download=`seeds-${new Date().toISOString().split("T")[0]}.csv`,r.click(),URL.revokeObjectURL(s),a.default.success("CSV file downloaded successfully!")},Z=()=>{if(0===e.length)return void a.default.error("No data to export");let t=window.open("","_blank","width=900,height=700");if(!t)return void a.default.error("Please allow popups to export PDF");let s=new Date().toLocaleDateString(),r=new Date().toLocaleTimeString(),l=`
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
          <div class="header-info">Generated on: ${s} at ${r}</div>
          <div class="header-info">Total Seeds: ${p} | Showing: ${e.length} seeds</div>
          <div class="header-info">Page: ${c} of ${h}</div>
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
            ${e.map((e,t)=>`
                <tr>
                  <td>${t+1+(c-1)*b}</td>
                  <td><strong>${e.name}</strong></td>
                  <td><span class="category-badge">${e.category||"other"}</span></td>
                  <td>${e.description||"-"}</td>
                  <td>${new Date(e.createdAt).toLocaleDateString()}</td>
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
    `;t.document.write(l),t.document.close(),t.focus(),a.default.success("PDF export opened - please use browser's print dialog and select 'Save as PDF'")},ee=()=>{if(0===e.length)return void a.default.error("No data to print");let t=window.open("","_blank","width=900,height=700");if(!t)return void a.default.error("Please allow popups to print");let s=new Date().toLocaleDateString(),r=new Date().toLocaleTimeString(),l=`
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
          <div class="header-info">Generated on: ${s} at ${r}</div>
          <div class="header-info">Total Seeds: ${p} | Showing: ${e.length} seeds</div>
          <div class="header-info">Page: ${c} of ${h}</div>
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
            ${e.map((e,t)=>`
                <tr>
                  <td>${t+1+(c-1)*b}</td>
                  <td><strong>${e.name}</strong></td>
                  <td><span class="category-badge">${e.category||"other"}</span></td>
                  <td>${e.description||"-"}</td>
                  <td>${new Date(e.createdAt).toLocaleDateString()}</td>
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
    `;t.document.write(l),t.document.close(),t.focus(),a.default.success("Print window opened!")},et=e=>{$(e),F(e.name),A(e.description||""),T(e.category||"other"),y(!0)},es=e=>{$(e),j(!0)},er=()=>{J(),N(!0)};return(0,t.jsxs)("div",{className:"p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen",children:[O&&(0,t.jsx)("div",{className:"fixed inset-0 bg-black/10 z-50 flex items-center justify-center",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"})}),(0,t.jsxs)("div",{className:"mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl md:text-2xl font-bold text-gray-800",children:"Seeds"}),(0,t.jsxs)("p",{className:"text-gray-600 mt-1",children:["Manage seed varieties for your farm. ",p," seeds found."]})]}),(0,t.jsx)("div",{className:"flex justify-end",children:(0,t.jsxs)("button",{onClick:er,className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors",children:[(0,t.jsx)(r.FaPlus,{className:"text-sm"}),"Add New Seed"]})})]}),(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow mb-4 border border-gray-200",children:[(0,t.jsxs)("div",{className:"p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsxs)("label",{className:"flex items-center space-x-2 text-sm text-gray-700",children:[(0,t.jsx)("input",{type:"checkbox",checked:E.length===e.length&&e.length>0,onChange:H,className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"}),(0,t.jsx)("span",{children:"Select All"})]}),E.length>0&&(0,t.jsxs)("button",{onClick:Y,className:"ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",children:[(0,t.jsx)(r.FaTrash,{className:"text-sm"}),"Delete Selected (",E.length,")"]})]}),(0,t.jsx)("div",{className:"lg:hidden flex flex-wrap gap-2",children:[{label:"Copy",icon:r.FaCopy,onClick:q,color:"bg-gray-100 hover:bg-gray-200",disabled:0===e.length},{label:"Excel",icon:r.FaFileExcel,onClick:Q,color:"bg-green-100 hover:bg-green-200",disabled:0===e.length},{label:"CSV",icon:r.FaFileCsv,onClick:X,color:"bg-blue-100 hover:bg-blue-200",disabled:0===e.length},{label:"PDF",icon:r.FaFilePdf,onClick:Z,color:"bg-red-100 hover:bg-red-200",disabled:0===e.length},{label:"Print",icon:r.FaPrint,onClick:ee,color:"bg-purple-100 hover:bg-purple-200",disabled:0===e.length}].map((e,s)=>(0,t.jsxs)("div",{className:"relative group",title:e.label,children:[(0,t.jsx)("button",{onClick:e.onClick,disabled:e.disabled,className:`p-2 rounded transition-colors ${e.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,t.jsx)(e.icon,{})}),(0,t.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:e.label})]},s))})]}),(0,t.jsxs)("div",{className:"p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200",children:[(0,t.jsxs)("div",{className:"relative max-w-md",children:[(0,t.jsx)(r.FaSearch,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"}),(0,t.jsx)("input",{type:"text",placeholder:"Search seeds...",value:i,onChange:e=>{n(e.target.value),x(1)},className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"})]}),(0,t.jsx)("div",{className:"lg:flex flex-wrap gap-2 hidden",children:[{label:"Copy",icon:r.FaCopy,onClick:q,color:"bg-gray-100 hover:bg-gray-200",disabled:0===e.length},{label:"Excel",icon:r.FaFileExcel,onClick:Q,color:"bg-green-100 hover:bg-green-200",disabled:0===e.length},{label:"CSV",icon:r.FaFileCsv,onClick:X,color:"bg-blue-100 hover:bg-blue-200",disabled:0===e.length},{label:"PDF",icon:r.FaFilePdf,onClick:Z,color:"bg-red-100 hover:bg-red-200",disabled:0===e.length},{label:"Print",icon:r.FaPrint,onClick:ee,color:"bg-purple-100 hover:bg-purple-200",disabled:0===e.length}].map((e,s)=>(0,t.jsxs)("div",{className:"relative group",title:e.label,children:[(0,t.jsx)("button",{onClick:e.onClick,disabled:e.disabled,className:`p-2 rounded transition-colors ${e.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,t.jsx)(e.icon,{})}),(0,t.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:e.label})]},s))})]})]}),(0,t.jsxs)("div",{className:"hidden lg:block bg-white rounded-lg shadow overflow-hidden border border-gray-200",children:[(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"min-w-full divide-y divide-gray-200",children:[(0,t.jsx)("thead",{className:"bg-gray-50",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"w-12 px-4 py-3",children:(0,t.jsx)("input",{type:"checkbox",checked:E.length===e.length&&e.length>0,onChange:H,className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"})}),(0,t.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Sr."}),(0,t.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Seed Name"}),(0,t.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Category"}),(0,t.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Created Date"}),(0,t.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Actions"})]})}),(0,t.jsx)("tbody",{className:"bg-white divide-y divide-gray-200",children:e.map((e,s)=>(0,t.jsxs)("tr",{className:"hover:bg-gray-50 transition-colors",children:[(0,t.jsx)("td",{className:"px-4 py-3",children:(0,t.jsx)("input",{type:"checkbox",checked:E.includes(e._id),onChange:()=>K(e._id),className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"})}),(0,t.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:s+1+(c-1)*b}),(0,t.jsxs)("td",{className:"px-4 py-3 text-sm text-gray-900",children:[(0,t.jsxs)("div",{className:"font-medium flex items-center gap-2",children:[(0,t.jsx)(r.FaSeedling,{className:"text-green-500 text-sm"}),e.name]}),e.description&&(0,t.jsx)("div",{className:"text-xs text-gray-500 mt-1",children:e.description})]}),(0,t.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:(0,t.jsx)("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",children:e.category||"other"})}),(0,t.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:(0,t.jsx)("div",{className:"text-xs text-gray-500",children:new Date(e.createdAt).toLocaleDateString()})}),(0,t.jsx)("td",{className:"px-4 py-3 text-sm",children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsxs)("div",{className:"relative group",children:[(0,t.jsx)("button",{onClick:()=>et(e),className:"text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors border border-blue-200",title:"Edit",children:(0,t.jsx)(r.FaEdit,{})}),(0,t.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:"Edit"})]}),(0,t.jsxs)("div",{className:"relative group",children:[(0,t.jsx)("button",{onClick:()=>es(e),className:"text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors border border-red-200",title:"Delete",children:(0,t.jsx)(r.FaTrash,{})}),(0,t.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:"Delete"})]})]})})]},e._id))})]})}),0===e.length&&!O&&(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)("div",{className:"text-gray-400 text-5xl mb-4",children:"🌱"}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No seeds found"}),(0,t.jsx)("p",{className:"text-gray-500 mb-4",children:i?`No results for "${i}". Try a different search.`:"Add your first seed to get started."}),(0,t.jsxs)("button",{onClick:er,className:"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto",children:[(0,t.jsx)(r.FaPlus,{className:"text-lg"}),"Add New Seed"]})]}),e.length>0&&(0,t.jsxs)("div",{className:"border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsxs)("div",{className:"text-sm text-gray-700",children:["Showing ",(0,t.jsx)("span",{className:"font-semibold",children:1+(c-1)*b})," to"," ",(0,t.jsx)("span",{className:"font-semibold",children:Math.min(c*b,p)})," of"," ",(0,t.jsx)("span",{className:"font-semibold",children:p})," entries"]}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsxs)("select",{value:b,onChange:e=>{u(Number(e.target.value)),x(1)},className:"pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white",children:[(0,t.jsx)("option",{value:10,children:"10 rows"}),(0,t.jsx)("option",{value:25,children:"25 rows"}),(0,t.jsx)("option",{value:50,children:"50 rows"}),(0,t.jsx)("option",{value:100,children:"100 rows"})]}),(0,t.jsx)("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700",children:(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsxs)("button",{onClick:()=>x(1),disabled:1===c,className:"p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,t.jsx)("span",{className:"sr-only",children:"First"}),(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M11 19l-7-7 7-7m8 14l-7-7 7-7"})})]}),(0,t.jsx)("button",{onClick:()=>x(Math.max(1,c-1)),disabled:1===c,className:"px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Previous"}),Array.from({length:Math.min(5,h)},(e,s)=>{let r;return r=h<=5||c<=3?s+1:c>=h-2?h-4+s:c-2+s,(0,t.jsx)("button",{onClick:()=>x(r),className:`px-3 py-1 rounded ${c===r?"bg-blue-600 text-white":"border border-gray-300 hover:bg-gray-50"}`,children:r},s)}),(0,t.jsx)("button",{onClick:()=>x(Math.min(h,c+1)),disabled:c===h,className:"px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Next"}),(0,t.jsxs)("button",{onClick:()=>x(h),disabled:c===h,className:"p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,t.jsx)("span",{className:"sr-only",children:"Last"}),(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M13 5l7 7-7 7M5 5l7 7-7 7"})})]})]})]})]}),(0,t.jsxs)("div",{className:"lg:hidden space-y-4",children:[e.map((e,s)=>{let a,l;return(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow border border-gray-200 overflow-hidden",children:[(0,t.jsx)("div",{className:"p-4 border-b border-gray-100",children:(0,t.jsxs)("div",{className:"flex items-start justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("input",{type:"checkbox",checked:E.includes(e._id),onChange:()=>K(e._id),className:"h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(r.FaSeedling,{className:"text-green-500"}),(0,t.jsx)("h3",{className:"font-semibold text-gray-900",children:e.name})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mt-1",children:[(0,t.jsxs)("span",{className:`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${((e="other")=>{let t={vegetable:"bg-green-100 text-green-800",fruit:"bg-red-100 text-red-800",grain:"bg-yellow-100 text-yellow-800",herb:"bg-purple-100 text-purple-800",flower:"bg-pink-100 text-pink-800",other:"bg-gray-100 text-gray-800"};return t[e]||t.other})(e.category)}`,children:[(0,t.jsx)(r.FaTag,{className:"mr-1"}),e.category||"other"]}),(0,t.jsxs)("span",{className:"text-xs text-gray-500",children:["#",s+1+(c-1)*b]})]})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)("button",{onClick:()=>et(e),className:"text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors",title:"Edit",children:(0,t.jsx)(r.FaEdit,{className:"text-sm"})}),(0,t.jsx)("button",{onClick:()=>es(e),className:"text-red-600 hover:bg-red-50 p-2 rounded transition-colors",title:"Delete",children:(0,t.jsx)(r.FaTrash,{className:"text-sm"})}),(0,t.jsx)("button",{onClick:()=>{var t;let s;return t=e._id,s=new Set(R),void(R.has(t)?s.delete(t):s.add(t),U(s))},className:"text-gray-500 hover:bg-gray-100 p-2 rounded transition-colors",children:(a=e._id,R.has(a))?(0,t.jsx)(r.FaChevronUp,{}):(0,t.jsx)(r.FaChevronDown,{})})]})]})}),(0,t.jsxs)("div",{className:"p-4",children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3 mb-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"text-xs text-gray-500 flex items-center gap-1",children:[(0,t.jsx)(r.FaCalendarAlt,{className:"text-gray-400"}),"Created"]}),(0,t.jsx)("div",{className:"text-sm font-medium",children:new Date(e.createdAt).toLocaleDateString()})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"text-xs text-gray-500",children:"Last Updated"}),(0,t.jsx)("div",{className:"text-sm",children:new Date(e.updatedAt).toLocaleDateString()})]})]}),e.description&&(0,t.jsxs)("div",{className:"mt-2",children:[(0,t.jsxs)("div",{className:"text-xs text-gray-500 flex items-center gap-1 mb-1",children:[(0,t.jsx)(r.FaInfoCircle,{className:"text-gray-400"}),"Description"]}),(0,t.jsx)("p",{className:"text-sm text-gray-700 line-clamp-2",children:e.description})]})]}),(l=e._id,R.has(l)&&(0,t.jsx)("div",{className:"px-4 pb-4 border-t border-gray-100 pt-3",children:(0,t.jsxs)("div",{className:"space-y-3",children:[!e.description&&(0,t.jsx)("div",{className:"text-sm text-gray-500 italic",children:"No description provided"}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"text-xs text-gray-500",children:"Record ID"}),(0,t.jsx)("div",{className:"text-xs font-mono text-gray-700 truncate",children:e._id})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"text-xs text-gray-500",children:"Full Category"}),(0,t.jsx)("div",{className:"text-sm font-medium capitalize",children:e.category||"other"})]})]}),(0,t.jsxs)("div",{className:"flex justify-between pt-3 border-t border-gray-100",children:[(0,t.jsxs)("div",{className:"text-xs text-gray-500",children:["Created: ",new Date(e.createdAt).toLocaleString()]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:()=>et(e),className:"text-xs text-blue-600 hover:text-blue-800 font-medium",children:"Edit"}),(0,t.jsx)("button",{onClick:()=>es(e),className:"text-xs text-red-600 hover:text-red-800 font-medium",children:"Delete"})]})]})]})}))]},e._id)}),0===e.length&&!O&&(0,t.jsxs)("div",{className:"text-center py-12 bg-white rounded-lg shadow border border-gray-200",children:[(0,t.jsx)("div",{className:"text-gray-400 text-5xl mb-4",children:"🌱"}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No seeds found"}),(0,t.jsx)("p",{className:"text-gray-500 mb-4",children:i?`No results for "${i}". Try a different search.`:"Add your first seed to get started."}),(0,t.jsxs)("button",{onClick:er,className:"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto",children:[(0,t.jsx)(r.FaPlus,{className:"text-lg"}),"Add New Seed"]})]}),e.length>0&&(0,t.jsx)("div",{className:"bg-white rounded-lg shadow border border-gray-200 p-4 mt-4",children:(0,t.jsxs)("div",{className:"flex flex-col space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"text-sm text-gray-700",children:["Showing ",1+(c-1)*b," to ",Math.min(c*b,p)," of ",p]}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsxs)("select",{value:b,onChange:e=>{u(Number(e.target.value)),x(1)},className:"pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white",children:[(0,t.jsx)("option",{value:10,children:"10 rows"}),(0,t.jsx)("option",{value:25,children:"25 rows"}),(0,t.jsx)("option",{value:50,children:"50 rows"})]}),(0,t.jsx)("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700",children:(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})})]})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("button",{onClick:()=>x(Math.max(1,c-1)),disabled:1===c,className:"px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:[(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M15 19l-7-7 7-7"})}),"Previous"]}),(0,t.jsx)("div",{className:"flex items-center gap-1",children:Array.from({length:Math.min(3,h)},(e,s)=>{let r;return r=h<=3||1===c?s+1:c===h?h-2+s:c-1+s,(0,t.jsx)("button",{onClick:()=>x(r),className:`px-3 py-1 text-sm rounded ${c===r?"bg-blue-600 text-white":"border border-gray-300 hover:bg-gray-50"}`,children:r},s)})}),(0,t.jsxs)("button",{onClick:()=>x(Math.min(h,c+1)),disabled:c===h,className:"px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",children:["Next",(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 5l7 7-7 7"})})]})]}),(0,t.jsxs)("div",{className:"text-center text-xs text-gray-500",children:["Page ",c," of ",h]})]})})]}),(0,t.jsx)("div",{className:`fixed inset-0 z-50 ${w?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-lg",children:(0,t.jsxs)("div",{className:"p-6",children:[(0,t.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Add New Seed"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Seed Name *"}),(0,t.jsx)("input",{type:"text",value:D,onChange:e=>F(e.target.value),placeholder:"e.g., 618, NAMI TOMATO, ULLAS TOMATO",disabled:O,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Enter the seed variety name"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Description"}),(0,t.jsx)("textarea",{value:L,onChange:e=>A(e.target.value),placeholder:"Optional description for the seed",disabled:O,rows:3,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Category"}),(0,t.jsx)("select",{value:P,onChange:e=>T(e.target.value),disabled:O,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50",children:_.map(e=>(0,t.jsx)("option",{value:e.value,children:e.label},e.value))})]})]}),(0,t.jsxs)("div",{className:"flex justify-end gap-2 mt-6",children:[(0,t.jsx)("button",{onClick:()=>N(!1),disabled:O,className:"px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50",children:"Cancel"}),(0,t.jsx)("button",{onClick:I,disabled:!D.trim()||O,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:O?"Adding...":"Add Seed"})]})]})})}),(0,t.jsx)("div",{className:`fixed inset-0 z-50 ${f?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-lg",children:(0,t.jsxs)("div",{className:"p-6",children:[(0,t.jsxs)("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:["Edit Seed: ",S?.name]}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Seed Name *"}),(0,t.jsx)("input",{type:"text",value:D,onChange:e=>F(e.target.value),disabled:O,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Description"}),(0,t.jsx)("textarea",{value:L,onChange:e=>A(e.target.value),disabled:O,rows:3,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Category"}),(0,t.jsx)("select",{value:P,onChange:e=>T(e.target.value),disabled:O,className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50",children:_.map(e=>(0,t.jsx)("option",{value:e.value,children:e.label},e.value))})]})]}),(0,t.jsxs)("div",{className:"flex justify-end gap-2 mt-6",children:[(0,t.jsx)("button",{onClick:()=>y(!1),disabled:O,className:"px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50",children:"Cancel"}),(0,t.jsx)("button",{onClick:W,disabled:!D.trim()||O,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:O?"Saving...":"Save Changes"})]})]})})}),(0,t.jsx)("div",{className:`fixed inset-0 z-50 ${v?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-md",children:(0,t.jsxs)("div",{className:"p-6 text-center",children:[(0,t.jsx)("div",{className:"text-red-500 text-5xl mb-4",children:"🗑️"}),(0,t.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Delete Seed?"}),(0,t.jsxs)("p",{className:"text-gray-600 mb-6",children:['Are you sure you want to delete "',S?.name,'"? This action cannot be undone.']}),(0,t.jsxs)("div",{className:"flex justify-center gap-3",children:[(0,t.jsx)("button",{onClick:()=>j(!1),disabled:O,className:"px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50",children:"Cancel"}),(0,t.jsx)("button",{onClick:V,disabled:O,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50",children:O?"Deleting...":"Delete"})]})]})})}),(0,t.jsx)("div",{className:`fixed inset-0 z-50 ${k?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-md",children:(0,t.jsxs)("div",{className:"p-6 text-center",children:[(0,t.jsx)("div",{className:"text-red-500 text-5xl mb-4",children:"🗑️"}),(0,t.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Delete Selected Seeds?"}),(0,t.jsxs)("p",{className:"text-gray-600 mb-6",children:["Are you sure you want to delete ",E.length," selected seed(s)? This action cannot be undone."]}),(0,t.jsxs)("div",{className:"flex justify-center gap-3",children:[(0,t.jsx)("button",{onClick:()=>C(!1),disabled:O,className:"px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50",children:"Cancel"}),(0,t.jsx)("button",{onClick:G,disabled:O,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50",children:O?"Deleting...":`Delete ${E.length} Seeds`})]})]})})})]})}e.s(["default",()=>o])}]);