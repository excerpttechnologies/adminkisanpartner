(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,654107,e=>{"use strict";var t=e.i(475100),r=e.i(442775),o=e.i(521601);function l(){let[e,l]=(0,r.useState)([]),[s,a]=(0,r.useState)([]),[d,n]=(0,r.useState)(!1),[i,c]=(0,r.useState)(!1),[p,x]=(0,r.useState)(!1),[h,b]=(0,r.useState)(!1),[g,m]=(0,r.useState)(""),[u,f]=(0,r.useState)(""),[y,w]=(0,r.useState)(null),[v,j]=(0,r.useState)(null),[N,C]=(0,r.useState)(""),[k,S]=(0,r.useState)("asc"),[D,E]=(0,r.useState)(null),[F,$]=(0,r.useState)(!0),[L,B]=(0,r.useState)(""),[T,O]=(0,r.useState)(1),[P,R]=(0,r.useState)(5),[M,A]=(0,r.useState)(0),[I,U]=(0,r.useState)(1);(0,r.useRef)(null);let z=async(e="asc")=>{try{$(!0);let t=await fetch(`/api/breeds?sort=${e}&sortBy=sortOrder`),r=await t.json();r.success?(l(r.data),a(r.data),A(r.data.length),W(r.data)):E("Error fetching breeds")}catch(e){console.error("Error fetching breeds:",e),E("Failed to load breeds")}finally{$(!1)}};(0,r.useEffect)(()=>{z(k)},[k]),(0,r.useEffect)(()=>{if(""===L.trim())a(e),A(e.length),O(1),W(e);else{let t=L.toLowerCase(),r=e.filter(e=>e.name.toLowerCase().includes(t)||e.id.toLowerCase().includes(t));a(r),A(r.length),O(1),W(r)}},[L,e]);let W=(0,r.useCallback)(e=>{let t=Math.ceil(e.length/P);U(t),T>t&&t>0&&O(t)},[P,T]),V=()=>{let e=(T-1)*P,t=e+P;return s.slice(e,t)},K=()=>{try{let t=s.length>0?s:e;if(0===t.length)return void E("No data to copy");let r=Math.max(2,t.length.toString().length),o=Math.max(10,...t.map(e=>e.name?.length||0)),l=["ID".padEnd(r),"Breed Name".padEnd(o),"Sort Order".padEnd(10),"Created Date".padEnd(12)].join("	"),a=["-".repeat(r),"-".repeat(o),"-".repeat(10),"-".repeat(12)].join("	"),d=t.map((e,t)=>[(t+1).toString().padEnd(r),(e.name||"").padEnd(o),(e.sortOrder?.toString()||"").padEnd(10),new Date().toLocaleDateString().padEnd(12)].join("	")).join("\n"),n=`${l}
${a}
${d}`,i=`

Total Breeds: ${t.length}`;s.length>0&&(i+=` (Filtered from ${e.length} total)`);let c=n+i;navigator.clipboard.writeText(c).then(()=>{q(`Copied ${t.length} breed${1!==t.length?"s":""} to clipboard`)}).catch(e=>{console.error("Failed to copy: ",e),E("Failed to copy to clipboard")})}catch(e){console.error("Error copying to clipboard:",e),E("Failed to copy data")}},_=()=>{try{let t=s.length>0?s:e;if(0===t.length)return void E("No data to export");let r=`
        <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:html="http://www.w3.org/TR/REC-html40">
          <Worksheet ss:Name="Breeds">
            <Table>
              <Row>
                <Cell><Data ss:Type="String">ID</Data></Cell>
                <Cell><Data ss:Type="String">Breed Name</Data></Cell>
                <Cell><Data ss:Type="String">Sort Order</Data></Cell>
                <Cell><Data ss:Type="String">Created Date</Data></Cell>
              </Row>
              ${t.map((e,t)=>`
                <Row>
                  <Cell><Data ss:Type="Number">${t+1}</Data></Cell>
                  <Cell><Data ss:Type="String">${e.name}</Data></Cell>
                  <Cell><Data ss:Type="Number">${e.sortOrder}</Data></Cell>
                  <Cell><Data ss:Type="String">${new Date().toLocaleDateString()}</Data></Cell>
                </Row>
              `).join("")}
            </Table>
          </Worksheet>
        </Workbook>
      `,o=new Blob(['<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>'+r],{type:"application/vnd.ms-excel"}),l=URL.createObjectURL(o),a=document.createElement("a");a.href=l,a.download=`breeds_${new Date().toISOString().split("T")[0]}.xls`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(l),q(`Exported ${t.length} breeds to Excel`)}catch(e){console.error("Error exporting to Excel:",e),E("Failed to export to Excel")}},J=()=>{try{let t=s.length>0?s:e;if(0===t.length)return void E("No data to export");let r=t.map((e,t)=>[t+1,`"${e.name.replace(/"/g,'""')}"`,e.sortOrder,new Date().toLocaleDateString()]),o=["ID,Breed Name,Sort Order,Created Date",...r.map(e=>e.join(","))].join("\n"),l=new Blob([o],{type:"text/csv;charset=utf-8;"}),a=URL.createObjectURL(l),d=document.createElement("a");d.href=a,d.download=`breeds_${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(a),q(`Exported ${t.length} breeds to CSV`)}catch(e){console.error("Error exporting to CSV:",e),E("Failed to export to CSV")}},Y=()=>{try{let t=s.length>0?s:e;if(0===t.length)return void E("No data to export");let r=window.open("","_blank","width=900,height=700");if(!r)return void E("Please allow popups to export PDF");let o=new Date().toLocaleDateString(),l=new Date().toLocaleTimeString(),a=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Breeds Report</title>
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
            .sort-badge {
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
            <h1>🐄 Breeds Report</h1>
            <div class="header-info">Generated on: ${o} at ${l}</div>
            <div class="header-info">Total Breeds: ${t.length}</div>
            ${L?`<div class="header-info">Search filter: "${L}"</div>`:""}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Breed Name</th>
                <th>Sort Order</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${t.map((e,t)=>`
                  <tr>
                    <td>${t+1}</td>
                    <td><strong>${e.name}</strong></td>
                    <td><span class="sort-badge">${e.sortOrder}</span></td>
                    <td>${new Date().toLocaleDateString()}</td>
                  </tr>
                `).join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Printed from Breeds Management System | ${window.location.hostname}</p>
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
      `;r.document.write(a),r.document.close(),r.focus(),q("PDF export opened - please use browser's print dialog and select 'Save as PDF'")}catch(e){console.error("Error exporting to PDF:",e),E("Failed to export to PDF")}},G=()=>{try{let t=s.length>0?s:e;if(0===t.length)return void E("No data to print");let r=window.open("","_blank");if(!r)return void E("Please allow popups to print");let o=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Breeds Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f5f5f5; padding: 10px; border: 1px solid #ddd; text-align: left; }
            td { padding: 10px; border: 1px solid #ddd; }
            .info { margin: 20px 0; color: #666; }
            @media print {
              @page { margin: 0.5in; }
              body { margin: 0; }
              .no-print { display: none; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Breeds Report</h1>
          <div class="info">
            Generated on: ${new Date().toLocaleString()}<br>
            Total breeds: ${t.length}<br>
            ${L?`Search filter: "${L}"`:""}
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Breed Name</th>
                <th>Sort Order</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${t.map((e,t)=>`
                <tr>
                  <td>${t+1}</td>
                  <td>${e.name}</td>
                  <td>${e.sortOrder}</td>
                  <td>${new Date().toLocaleDateString()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            Report generated from Breed Management System
          </div>
          <div style="text-align: center; margin-top: 20px;" class="no-print">
            <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Report
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
              Close
            </button>
          </div>
        </body>
        </html>
      `;r.document.write(o),r.document.close(),r.focus(),setTimeout(()=>{r.print()},500),q("Print dialog opened")}catch(e){console.error("Error printing:",e),E("Failed to print")}},q=e=>{E(e),setTimeout(()=>E(null),2500)},H=async()=>{if(!g.trim())return void E("Please enter a breed name");let e=parseInt(u)||0;try{let t=await fetch("/api/breeds",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:g.trim(),sortOrder:e})}),r=await t.json();if(r.success){let e=r.data;l(t=>[...t,e]),(""===L||e.name.toLowerCase().includes(L.toLowerCase())||e.id.toLowerCase().includes(L.toLowerCase()))&&(a(t=>[...t,e]),A(e=>e+1),W([...s,e])),n(!1),m(""),f(""),q("Breed added successfully"),z(k)}else E(r.error||"Failed to add breed")}catch(e){console.error("Error adding breed:",e),E("Failed to add breed")}},Q=async()=>{if(!g.trim()||!y)return void console.log("Missing breed name or ID");let e=parseInt(u)||0;try{console.log("Saving edit for breed ID:",y,"New name:",g,"Sort order:",e);let t=await fetch(`/api/breeds/${y}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:g.trim(),sortOrder:e})}),r=await t.json();if(console.log("Edit response:",r),r.success){let e=r.data;l(t=>t.map(t=>t.id===y?{...t,name:e.name,sortOrder:e.sortOrder}:t)),a(t=>t.map(t=>t.id===y?{...t,name:e.name,sortOrder:e.sortOrder}:t)),c(!1),w(null),m(""),f(""),q("Breed updated successfully"),z(k)}else E(r.error||"Failed to update breed")}catch(e){console.error("Error updating breed:",e),E("Failed to update breed")}},X=async()=>{if(v)try{console.log("Deleting breed ID:",v);let e=await fetch(`/api/breeds/${v}`,{method:"DELETE"}),t=await e.json();if(console.log("Delete response:",t),t.success){l(e=>e.filter(e=>e.id!==v));let e=s.filter(e=>e.id!==v);a(e),A(e.length),W(e),0===V().length&&T>1&&O(T-1),q("Breed deleted successfully")}else E(t.error||"Failed to delete breed")}catch(e){console.error("Error deleting breed:",e),E("Failed to delete breed")}finally{x(!1),j(null),C("")}},Z=async()=>{let t=s.filter(e=>e.selected).map(e=>e.id);if(0===t.length)return void E("No breeds selected");try{let r=await fetch("/api/breeds/bulk",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ids:t})}),o=await r.json();if(o.success){let r=e.filter(e=>!t.includes(e.id));l(r);let d=s.filter(e=>!t.includes(e.id));a(d),A(d.length),W(d),t.length===V().length&&T>1&&O(T-1),q(o.message||"Selected breeds deleted successfully")}else E(o.error||"Failed to delete selected breeds")}catch(e){console.error("Error deleting selected breeds:",e),E("Failed to delete selected breeds")}finally{b(!1)}},ee=e=>{let t=t=>t.map(t=>t.id===e?{...t,selected:!t.selected}:t);l(t),a(t)},et=e=>{e>=1&&e<=I&&O(e)},er=(T-1)*P+1,eo=V();return(0,t.jsxs)("div",{className:"p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen",children:[F&&(0,t.jsx)("div",{className:"fixed inset-0 bg-black/10 z-50 flex items-center justify-center",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"})}),D&&(0,t.jsx)("div",{className:`mb-4 px-4 py-3 rounded text-sm ${D.includes("Error")||D.includes("Failed")?"bg-red-100 text-red-800 border border-red-200":"bg-green-100 text-green-800 border border-green-200"}`,children:D}),(0,t.jsxs)("div",{className:"mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl md:text-2xl font-bold text-gray-800",children:"Breeds"}),(0,t.jsxs)("p",{className:"text-gray-600 mt-1",children:["Manage breed options for your farm. ",M," breeds found."]})]}),(0,t.jsx)("div",{className:"flex justify-end",children:(0,t.jsxs)("button",{onClick:()=>n(!0),className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors",children:[(0,t.jsx)(o.FaPlus,{className:"text-sm"}),"Add New Breed"]})})]}),(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow mb-4 border border-gray-200",children:[(0,t.jsxs)("div",{className:"p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsxs)("label",{className:"flex items-center space-x-2 text-sm text-gray-700",children:[(0,t.jsx)("input",{type:"checkbox",checked:eo.length>0&&eo.every(e=>e.selected),onChange:()=>{let e=eo.every(e=>e.selected);eo.forEach(t=>{e?t.selected&&ee(t.id):ee(t.id)})},className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"}),(0,t.jsx)("span",{children:"Select All on Page"})]}),s.some(e=>e.selected)&&(0,t.jsxs)("button",{onClick:()=>{0===s.filter(e=>e.selected).length?E("No breeds selected"):b(!0)},className:"ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",children:[(0,t.jsx)(o.FaTrash,{className:"text-sm"}),"Delete Selected (",s.filter(e=>e.selected).length,")"]})]}),(0,t.jsx)("div",{className:"lg:hidden flex flex-wrap gap-2",children:[{label:"Copy",icon:o.FaCopy,onClick:K,color:"bg-gray-100 hover:bg-gray-200",disabled:0===s.length},{label:"Excel",icon:o.FaFileExcel,onClick:_,color:"bg-green-100 hover:bg-green-200",disabled:0===s.length},{label:"CSV",icon:o.FaFileCsv,onClick:J,color:"bg-blue-100 hover:bg-blue-200",disabled:0===s.length},{label:"PDF",icon:o.FaFilePdf,onClick:Y,color:"bg-red-100 hover:bg-red-200",disabled:0===s.length},{label:"Print",icon:o.FaPrint,onClick:G,color:"bg-purple-100 hover:bg-purple-200",disabled:0===s.length}].map((e,r)=>(0,t.jsxs)("div",{className:"relative group",title:e.label,children:[(0,t.jsx)("button",{onClick:e.onClick,disabled:e.disabled,className:`p-2 rounded transition-colors ${e.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,t.jsx)(e.icon,{})}),(0,t.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:e.label})]},r))})]}),(0,t.jsxs)("div",{className:"p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200",children:[(0,t.jsxs)("div",{className:"relative max-w-md",children:[(0,t.jsx)(o.FaSearch,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"}),(0,t.jsx)("input",{type:"text",placeholder:"Search breeds...",value:L,onChange:e=>B(e.target.value),className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"}),L&&(0,t.jsx)("button",{onClick:()=>B(""),className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",children:(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})]}),(0,t.jsx)("div",{className:"lg:flex flex-wrap gap-2 hidden",children:[{label:"Copy",icon:o.FaCopy,onClick:K,color:"bg-gray-100 hover:bg-gray-200",disabled:0===s.length},{label:"Excel",icon:o.FaFileExcel,onClick:_,color:"bg-green-100 hover:bg-green-200",disabled:0===s.length},{label:"CSV",icon:o.FaFileCsv,onClick:J,color:"bg-blue-100 hover:bg-blue-200",disabled:0===s.length},{label:"PDF",icon:o.FaFilePdf,onClick:Y,color:"bg-red-100 hover:bg-red-200",disabled:0===s.length},{label:"Print",icon:o.FaPrint,onClick:G,color:"bg-purple-100 hover:bg-purple-200",disabled:0===s.length}].map((e,r)=>(0,t.jsxs)("div",{className:"relative group",title:e.label,children:[(0,t.jsx)("button",{onClick:e.onClick,disabled:e.disabled,className:`p-2 rounded transition-colors ${e.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,t.jsx)(e.icon,{})}),(0,t.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:e.label})]},r))})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow overflow-hidden border border-gray-200",children:[(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"min-w-full divide-y divide-gray-200",children:[(0,t.jsx)("thead",{className:"bg-gray-50",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"w-12 px-4 py-3",children:(0,t.jsx)("input",{type:"checkbox",checked:eo.length>0&&eo.every(e=>e.selected),onChange:()=>{let e=eo.every(e=>e.selected);eo.forEach(t=>{e?t.selected&&ee(t.id):ee(t.id)})},className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"})}),(0,t.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Sr."}),(0,t.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Breed Name"}),(0,t.jsx)("th",{onClick:()=>{let e="asc"===k?"desc":"asc";S(e),z(e)},className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",children:(0,t.jsxs)("div",{className:"flex items-center gap-1",children:["Sort","asc"===k?(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M5 15l7-7 7 7"})}):(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})]})}),(0,t.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Action"})]})}),(0,t.jsx)("tbody",{className:"bg-white divide-y divide-gray-200",children:eo.map((e,r)=>(0,t.jsxs)("tr",{className:"hover:bg-gray-50 transition-colors",children:[(0,t.jsx)("td",{className:"px-4 py-3",children:(0,t.jsx)("input",{type:"checkbox",checked:!!e.selected,onChange:()=>ee(e.id),className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"})}),(0,t.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:er+r}),(0,t.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:(0,t.jsx)("div",{className:"font-medium",children:e.name})}),(0,t.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:(0,t.jsx)("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",children:e.sortOrder})}),(0,t.jsx)("td",{className:"px-4 py-3 text-sm",children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsxs)("div",{className:"relative group",children:[(0,t.jsx)("button",{onClick:()=>{console.log("Opening edit modal for breed:",e),w(e.id),m(e.name),f(e.sortOrder.toString()),c(!0)},className:"text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors",title:"Edit",children:(0,t.jsx)(o.FaEdit,{})}),(0,t.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:"Edit"})]}),(0,t.jsxs)("div",{className:"relative group",children:[(0,t.jsx)("button",{onClick:()=>{var t,r;return t=e.id,r=e.name,void(j(t),C(r),x(!0))},className:"text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors",title:"Delete",children:(0,t.jsx)(o.FaTrash,{})}),(0,t.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:"Delete"})]})]})})]},e.id))})]})}),0===s.length&&!F&&(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)("div",{className:"text-gray-400 text-5xl mb-4",children:"🐄"}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No breeds found"}),(0,t.jsx)("p",{className:"text-gray-500 mb-4",children:L?`No results for "${L}". Try a different search.`:"Add your first breed to get started."}),(0,t.jsxs)("button",{onClick:()=>n(!0),className:"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto",children:[(0,t.jsx)(o.FaPlus,{className:"text-lg"}),"Add New Breed"]})]}),s.length>0&&(0,t.jsxs)("div",{className:"border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsxs)("div",{className:"text-sm text-gray-700",children:["Showing ",(0,t.jsx)("span",{className:"font-semibold",children:er})," to"," ",(0,t.jsx)("span",{className:"font-semibold",children:Math.min(er+eo.length-1,M)})," of"," ",(0,t.jsx)("span",{className:"font-semibold",children:M})," entries"]}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsxs)("select",{value:P,onChange:e=>{R(parseInt(e.target.value)),O(1)},className:"pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white",children:[(0,t.jsx)("option",{value:5,children:"5 rows"}),(0,t.jsx)("option",{value:10,children:"10 rows"}),(0,t.jsx)("option",{value:25,children:"25 rows"}),(0,t.jsx)("option",{value:50,children:"50 rows"}),(0,t.jsx)("option",{value:100,children:"100 rows"})]}),(0,t.jsx)("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700",children:(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsxs)("button",{onClick:()=>et(1),disabled:1===T,className:"p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,t.jsx)("span",{className:"sr-only",children:"First"}),(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M11 19l-7-7 7-7m8 14l-7-7 7-7"})})]}),(0,t.jsx)("button",{onClick:()=>et(T-1),disabled:1===T,className:"px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Previous"}),Array.from({length:Math.min(5,I)},(e,r)=>{let o;return o=I<=5||T<=3?r+1:T>=I-2?I-4+r:T-2+r,(0,t.jsx)("button",{onClick:()=>et(o),className:`px-3 py-1 rounded ${T===o?"bg-blue-600 text-white":"border border-gray-300 hover:bg-gray-50"}`,children:o},r)}),(0,t.jsx)("button",{onClick:()=>et(T+1),disabled:T===I,className:"px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Next"}),(0,t.jsxs)("button",{onClick:()=>et(I),disabled:T===I,className:"p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,t.jsx)("span",{className:"sr-only",children:"Last"}),(0,t.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M13 5l7 7-7 7M5 5l7 7-7 7"})})]})]})]})]}),(0,t.jsx)("div",{className:`fixed inset-0 z-50 ${d||i?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-lg",children:(0,t.jsxs)("div",{className:"p-6",children:[(0,t.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:i?"Edit Breed":"Add New Breed"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Breed Name *"}),(0,t.jsx)("input",{type:"text",value:g,onChange:e=>m(e.target.value),placeholder:"Enter breed name",className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",onKeyDown:e=>{"Enter"===e.key&&(i?Q():H())},autoFocus:!0})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Sort Order"}),(0,t.jsx)("input",{type:"number",min:"0",value:u,onChange:e=>f(e.target.value),placeholder:"Enter sort order (optional)",className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",onKeyDown:e=>{"Enter"===e.key&&(i?Q():H())}}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Lower numbers appear first. Leave empty for automatic ordering."})]})]}),(0,t.jsxs)("div",{className:"flex justify-end gap-2 mt-6",children:[(0,t.jsx)("button",{onClick:()=>{n(!1),c(!1),m(""),f("")},className:"px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors",children:"Cancel"}),(0,t.jsx)("button",{onClick:i?Q:H,disabled:!g.trim(),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:i?"Save Changes":"Add Breed"})]})]})})}),(0,t.jsx)("div",{className:`fixed inset-0 z-50 ${p?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-md",children:(0,t.jsxs)("div",{className:"p-6 text-center",children:[(0,t.jsx)("div",{className:"text-red-500 text-5xl mb-4",children:"🗑️"}),(0,t.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Delete Breed?"}),(0,t.jsxs)("p",{className:"text-gray-600 mb-6",children:['Are you sure you want to delete "',N,'"? This action cannot be undone.']}),(0,t.jsxs)("div",{className:"flex justify-center gap-3",children:[(0,t.jsx)("button",{onClick:()=>{x(!1),j(null),C("")},className:"px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors",children:"Cancel"}),(0,t.jsx)("button",{onClick:X,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",children:"Delete"})]})]})})}),(0,t.jsx)("div",{className:`fixed inset-0 z-50 ${h?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-md",children:(0,t.jsxs)("div",{className:"p-6 text-center",children:[(0,t.jsx)("div",{className:"text-red-500 text-5xl mb-4",children:"🗑️"}),(0,t.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Delete Selected Breeds?"}),(0,t.jsxs)("p",{className:"text-gray-600 mb-6",children:["Are you sure you want to delete ",s.filter(e=>e.selected).length," selected breed(s)? This action cannot be undone."]}),(0,t.jsxs)("div",{className:"flex justify-center gap-3",children:[(0,t.jsx)("button",{onClick:()=>b(!1),className:"px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors",children:"Cancel"}),(0,t.jsxs)("button",{onClick:Z,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",children:["Delete ",s.filter(e=>e.selected).length," Breeds"]})]})]})})})]})}e.s(["default",()=>l])}]);