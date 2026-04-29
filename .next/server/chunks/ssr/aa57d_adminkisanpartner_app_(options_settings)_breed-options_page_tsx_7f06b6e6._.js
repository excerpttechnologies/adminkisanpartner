module.exports=[659161,a=>{"use strict";var b=a.i(282814),c=a.i(288216),d=a.i(998050);function e(){let[a,e]=(0,c.useState)([]),[f,g]=(0,c.useState)([]),[h,i]=(0,c.useState)(!1),[j,k]=(0,c.useState)(!1),[l,m]=(0,c.useState)(!1),[n,o]=(0,c.useState)(!1),[p,q]=(0,c.useState)(""),[r,s]=(0,c.useState)(""),[t,u]=(0,c.useState)(null),[v,w]=(0,c.useState)(null),[x,y]=(0,c.useState)(""),[z,A]=(0,c.useState)("asc"),[B,C]=(0,c.useState)(null),[D,E]=(0,c.useState)(!0),[F,G]=(0,c.useState)(""),[H,I]=(0,c.useState)(1),[J,K]=(0,c.useState)(5),[L,M]=(0,c.useState)(0),[N,O]=(0,c.useState)(1);(0,c.useRef)(null);let P=async(a="asc")=>{try{E(!0);let b=await fetch(`/api/breeds?sort=${a}&sortBy=sortOrder`),c=await b.json();c.success?(e(c.data),g(c.data),M(c.data.length),Q(c.data)):C("Error fetching breeds")}catch(a){console.error("Error fetching breeds:",a),C("Failed to load breeds")}finally{E(!1)}};(0,c.useEffect)(()=>{P(z)},[z]),(0,c.useEffect)(()=>{if(""===F.trim())g(a),M(a.length),I(1),Q(a);else{let b=F.toLowerCase(),c=a.filter(a=>a.name.toLowerCase().includes(b)||a.id.toLowerCase().includes(b));g(c),M(c.length),I(1),Q(c)}},[F,a]);let Q=(0,c.useCallback)(a=>{let b=Math.ceil(a.length/J);O(b),H>b&&b>0&&I(b)},[J,H]),R=()=>{let a=(H-1)*J,b=a+J;return f.slice(a,b)},S=()=>{try{let b=f.length>0?f:a;if(0===b.length)return void C("No data to copy");let c=Math.max(2,b.length.toString().length),d=Math.max(10,...b.map(a=>a.name?.length||0)),e=["ID".padEnd(c),"Breed Name".padEnd(d),"Sort Order".padEnd(10),"Created Date".padEnd(12)].join("	"),g=["-".repeat(c),"-".repeat(d),"-".repeat(10),"-".repeat(12)].join("	"),h=b.map((a,b)=>[(b+1).toString().padEnd(c),(a.name||"").padEnd(d),(a.sortOrder?.toString()||"").padEnd(10),new Date().toLocaleDateString().padEnd(12)].join("	")).join("\n"),i=`${e}
${g}
${h}`,j=`

Total Breeds: ${b.length}`;f.length>0&&(j+=` (Filtered from ${a.length} total)`);let k=i+j;navigator.clipboard.writeText(k).then(()=>{X(`Copied ${b.length} breed${1!==b.length?"s":""} to clipboard`)}).catch(a=>{console.error("Failed to copy: ",a),C("Failed to copy to clipboard")})}catch(a){console.error("Error copying to clipboard:",a),C("Failed to copy data")}},T=()=>{try{let b=f.length>0?f:a;if(0===b.length)return void C("No data to export");let c=`
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
              ${b.map((a,b)=>`
                <Row>
                  <Cell><Data ss:Type="Number">${b+1}</Data></Cell>
                  <Cell><Data ss:Type="String">${a.name}</Data></Cell>
                  <Cell><Data ss:Type="Number">${a.sortOrder}</Data></Cell>
                  <Cell><Data ss:Type="String">${new Date().toLocaleDateString()}</Data></Cell>
                </Row>
              `).join("")}
            </Table>
          </Worksheet>
        </Workbook>
      `,d=new Blob(['<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>'+c],{type:"application/vnd.ms-excel"}),e=URL.createObjectURL(d),g=document.createElement("a");g.href=e,g.download=`breeds_${new Date().toISOString().split("T")[0]}.xls`,document.body.appendChild(g),g.click(),document.body.removeChild(g),URL.revokeObjectURL(e),X(`Exported ${b.length} breeds to Excel`)}catch(a){console.error("Error exporting to Excel:",a),C("Failed to export to Excel")}},U=()=>{try{let b=f.length>0?f:a;if(0===b.length)return void C("No data to export");let c=b.map((a,b)=>[b+1,`"${a.name.replace(/"/g,'""')}"`,a.sortOrder,new Date().toLocaleDateString()]),d=["ID,Breed Name,Sort Order,Created Date",...c.map(a=>a.join(","))].join("\n"),e=new Blob([d],{type:"text/csv;charset=utf-8;"}),g=URL.createObjectURL(e),h=document.createElement("a");h.href=g,h.download=`breeds_${new Date().toISOString().split("T")[0]}.csv`,document.body.appendChild(h),h.click(),document.body.removeChild(h),URL.revokeObjectURL(g),X(`Exported ${b.length} breeds to CSV`)}catch(a){console.error("Error exporting to CSV:",a),C("Failed to export to CSV")}},V=()=>{try{let b=f.length>0?f:a;if(0===b.length)return void C("No data to export");let c=window.open("","_blank","width=900,height=700");if(!c)return void C("Please allow popups to export PDF");let d=new Date().toLocaleDateString(),e=new Date().toLocaleTimeString(),g=`
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
            <div class="header-info">Generated on: ${d} at ${e}</div>
            <div class="header-info">Total Breeds: ${b.length}</div>
            ${F?`<div class="header-info">Search filter: "${F}"</div>`:""}
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
              ${b.map((a,b)=>`
                  <tr>
                    <td>${b+1}</td>
                    <td><strong>${a.name}</strong></td>
                    <td><span class="sort-badge">${a.sortOrder}</span></td>
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
      `;c.document.write(g),c.document.close(),c.focus(),X("PDF export opened - please use browser's print dialog and select 'Save as PDF'")}catch(a){console.error("Error exporting to PDF:",a),C("Failed to export to PDF")}},W=()=>{try{let b=f.length>0?f:a;if(0===b.length)return void C("No data to print");let c=window.open("","_blank");if(!c)return void C("Please allow popups to print");let d=`
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
            Total breeds: ${b.length}<br>
            ${F?`Search filter: "${F}"`:""}
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
              ${b.map((a,b)=>`
                <tr>
                  <td>${b+1}</td>
                  <td>${a.name}</td>
                  <td>${a.sortOrder}</td>
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
      `;c.document.write(d),c.document.close(),c.focus(),setTimeout(()=>{c.print()},500),X("Print dialog opened")}catch(a){console.error("Error printing:",a),C("Failed to print")}},X=a=>{C(a),setTimeout(()=>C(null),2500)},Y=async()=>{if(!p.trim())return void C("Please enter a breed name");let a=parseInt(r)||0;try{let b=await fetch("/api/breeds",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:p.trim(),sortOrder:a})}),c=await b.json();if(c.success){let a=c.data;e(b=>[...b,a]),(""===F||a.name.toLowerCase().includes(F.toLowerCase())||a.id.toLowerCase().includes(F.toLowerCase()))&&(g(b=>[...b,a]),M(a=>a+1),Q([...f,a])),i(!1),q(""),s(""),X("Breed added successfully"),P(z)}else C(c.error||"Failed to add breed")}catch(a){console.error("Error adding breed:",a),C("Failed to add breed")}},Z=async()=>{if(!p.trim()||!t)return void console.log("Missing breed name or ID");let a=parseInt(r)||0;try{console.log("Saving edit for breed ID:",t,"New name:",p,"Sort order:",a);let b=await fetch(`/api/breeds/${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:p.trim(),sortOrder:a})}),c=await b.json();if(console.log("Edit response:",c),c.success){let a=c.data;e(b=>b.map(b=>b.id===t?{...b,name:a.name,sortOrder:a.sortOrder}:b)),g(b=>b.map(b=>b.id===t?{...b,name:a.name,sortOrder:a.sortOrder}:b)),k(!1),u(null),q(""),s(""),X("Breed updated successfully"),P(z)}else C(c.error||"Failed to update breed")}catch(a){console.error("Error updating breed:",a),C("Failed to update breed")}},$=async()=>{if(v)try{console.log("Deleting breed ID:",v);let a=await fetch(`/api/breeds/${v}`,{method:"DELETE"}),b=await a.json();if(console.log("Delete response:",b),b.success){e(a=>a.filter(a=>a.id!==v));let a=f.filter(a=>a.id!==v);g(a),M(a.length),Q(a),0===R().length&&H>1&&I(H-1),X("Breed deleted successfully")}else C(b.error||"Failed to delete breed")}catch(a){console.error("Error deleting breed:",a),C("Failed to delete breed")}finally{m(!1),w(null),y("")}},_=async()=>{let b=f.filter(a=>a.selected).map(a=>a.id);if(0===b.length)return void C("No breeds selected");try{let c=await fetch("/api/breeds/bulk",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ids:b})}),d=await c.json();if(d.success){let c=a.filter(a=>!b.includes(a.id));e(c);let h=f.filter(a=>!b.includes(a.id));g(h),M(h.length),Q(h),b.length===R().length&&H>1&&I(H-1),X(d.message||"Selected breeds deleted successfully")}else C(d.error||"Failed to delete selected breeds")}catch(a){console.error("Error deleting selected breeds:",a),C("Failed to delete selected breeds")}finally{o(!1)}},aa=a=>{let b=b=>b.map(b=>b.id===a?{...b,selected:!b.selected}:b);e(b),g(b)},ab=a=>{a>=1&&a<=N&&I(a)},ac=(H-1)*J+1,ad=R();return(0,b.jsxs)("div",{className:"p-[.6rem] text-black text-sm md:p-1 overflow-x-auto min-h-screen",children:[D&&(0,b.jsx)("div",{className:"fixed inset-0 bg-black/10 z-50 flex items-center justify-center",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 bg-white p-1"})}),B&&(0,b.jsx)("div",{className:`mb-4 px-4 py-3 rounded text-sm ${B.includes("Error")||B.includes("Failed")?"bg-red-100 text-red-800 border border-red-200":"bg-green-100 text-green-800 border border-green-200"}`,children:B}),(0,b.jsxs)("div",{className:"mb-6 flex flex-wrap gap-y-3 lg:justify-between gap-x-3",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl md:text-2xl font-bold text-gray-800",children:"Breeds"}),(0,b.jsxs)("p",{className:"text-gray-600 mt-1",children:["Manage breed options for your farm. ",L," breeds found."]})]}),(0,b.jsx)("div",{className:"flex justify-end",children:(0,b.jsxs)("button",{onClick:()=>i(!0),className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors",children:[(0,b.jsx)(d.FaPlus,{className:"text-sm"}),"Add New Breed"]})})]}),(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow mb-4 border border-gray-200",children:[(0,b.jsxs)("div",{className:"p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)("label",{className:"flex items-center space-x-2 text-sm text-gray-700",children:[(0,b.jsx)("input",{type:"checkbox",checked:ad.length>0&&ad.every(a=>a.selected),onChange:()=>{let a=ad.every(a=>a.selected);ad.forEach(b=>{a?b.selected&&aa(b.id):aa(b.id)})},className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"}),(0,b.jsx)("span",{children:"Select All on Page"})]}),f.some(a=>a.selected)&&(0,b.jsxs)("button",{onClick:()=>{0===f.filter(a=>a.selected).length?C("No breeds selected"):o(!0)},className:"ml-2 border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",children:[(0,b.jsx)(d.FaTrash,{className:"text-sm"}),"Delete Selected (",f.filter(a=>a.selected).length,")"]})]}),(0,b.jsx)("div",{className:"lg:hidden flex flex-wrap gap-2",children:[{label:"Copy",icon:d.FaCopy,onClick:S,color:"bg-gray-100 hover:bg-gray-200",disabled:0===f.length},{label:"Excel",icon:d.FaFileExcel,onClick:T,color:"bg-green-100 hover:bg-green-200",disabled:0===f.length},{label:"CSV",icon:d.FaFileCsv,onClick:U,color:"bg-blue-100 hover:bg-blue-200",disabled:0===f.length},{label:"PDF",icon:d.FaFilePdf,onClick:V,color:"bg-red-100 hover:bg-red-200",disabled:0===f.length},{label:"Print",icon:d.FaPrint,onClick:W,color:"bg-purple-100 hover:bg-purple-200",disabled:0===f.length}].map((a,c)=>(0,b.jsxs)("div",{className:"relative group",title:a.label,children:[(0,b.jsx)("button",{onClick:a.onClick,disabled:a.disabled,className:`p-2 rounded transition-colors ${a.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,b.jsx)(a.icon,{})}),(0,b.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:a.label})]},c))})]}),(0,b.jsxs)("div",{className:"p-3 border-b flex lg:justify-between gap-x-3 flex-wrap gap-y-3 border-gray-200",children:[(0,b.jsxs)("div",{className:"relative max-w-md",children:[(0,b.jsx)(d.FaSearch,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"}),(0,b.jsx)("input",{type:"text",placeholder:"Search breeds...",value:F,onChange:a=>G(a.target.value),className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"}),F&&(0,b.jsx)("button",{onClick:()=>G(""),className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",children:(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})]}),(0,b.jsx)("div",{className:"lg:flex flex-wrap gap-2 hidden",children:[{label:"Copy",icon:d.FaCopy,onClick:S,color:"bg-gray-100 hover:bg-gray-200",disabled:0===f.length},{label:"Excel",icon:d.FaFileExcel,onClick:T,color:"bg-green-100 hover:bg-green-200",disabled:0===f.length},{label:"CSV",icon:d.FaFileCsv,onClick:U,color:"bg-blue-100 hover:bg-blue-200",disabled:0===f.length},{label:"PDF",icon:d.FaFilePdf,onClick:V,color:"bg-red-100 hover:bg-red-200",disabled:0===f.length},{label:"Print",icon:d.FaPrint,onClick:W,color:"bg-purple-100 hover:bg-purple-200",disabled:0===f.length}].map((a,c)=>(0,b.jsxs)("div",{className:"relative group",title:a.label,children:[(0,b.jsx)("button",{onClick:a.onClick,disabled:a.disabled,className:`p-2 rounded transition-colors ${a.color} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,b.jsx)(a.icon,{})}),(0,b.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:a.label})]},c))})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow overflow-hidden border border-gray-200",children:[(0,b.jsx)("div",{className:"overflow-x-auto",children:(0,b.jsxs)("table",{className:"min-w-full divide-y divide-gray-200",children:[(0,b.jsx)("thead",{className:"bg-gray-50",children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{className:"w-12 px-4 py-3",children:(0,b.jsx)("input",{type:"checkbox",checked:ad.length>0&&ad.every(a=>a.selected),onChange:()=>{let a=ad.every(a=>a.selected);ad.forEach(b=>{a?b.selected&&aa(b.id):aa(b.id)})},className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"})}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Sr."}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Breed Name"}),(0,b.jsx)("th",{onClick:()=>{let a="asc"===z?"desc":"asc";A(a),P(a)},className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",children:(0,b.jsxs)("div",{className:"flex items-center gap-1",children:["Sort","asc"===z?(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M5 15l7-7 7 7"})}):(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})]})}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Action"})]})}),(0,b.jsx)("tbody",{className:"bg-white divide-y divide-gray-200",children:ad.map((a,c)=>(0,b.jsxs)("tr",{className:"hover:bg-gray-50 transition-colors",children:[(0,b.jsx)("td",{className:"px-4 py-3",children:(0,b.jsx)("input",{type:"checkbox",checked:!!a.selected,onChange:()=>aa(a.id),className:"h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"})}),(0,b.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:ac+c}),(0,b.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:(0,b.jsx)("div",{className:"font-medium",children:a.name})}),(0,b.jsx)("td",{className:"px-4 py-3 text-sm text-gray-900",children:(0,b.jsx)("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",children:a.sortOrder})}),(0,b.jsx)("td",{className:"px-4 py-3 text-sm",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)("div",{className:"relative group",children:[(0,b.jsx)("button",{onClick:()=>{console.log("Opening edit modal for breed:",a),u(a.id),q(a.name),s(a.sortOrder.toString()),k(!0)},className:"text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors",title:"Edit",children:(0,b.jsx)(d.FaEdit,{})}),(0,b.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:"Edit"})]}),(0,b.jsxs)("div",{className:"relative group",children:[(0,b.jsx)("button",{onClick:()=>{var b,c;return b=a.id,c=a.name,void(w(b),y(c),m(!0))},className:"text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors",title:"Delete",children:(0,b.jsx)(d.FaTrash,{})}),(0,b.jsx)("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:"Delete"})]})]})})]},a.id))})]})}),0===f.length&&!D&&(0,b.jsxs)("div",{className:"text-center py-12",children:[(0,b.jsx)("div",{className:"text-gray-400 text-5xl mb-4",children:"🐄"}),(0,b.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No breeds found"}),(0,b.jsx)("p",{className:"text-gray-500 mb-4",children:F?`No results for "${F}". Try a different search.`:"Add your first breed to get started."}),(0,b.jsxs)("button",{onClick:()=>i(!0),className:"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors mx-auto",children:[(0,b.jsx)(d.FaPlus,{className:"text-lg"}),"Add New Breed"]})]}),f.length>0&&(0,b.jsxs)("div",{className:"border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsxs)("div",{className:"text-sm text-gray-700",children:["Showing ",(0,b.jsx)("span",{className:"font-semibold",children:ac})," to"," ",(0,b.jsx)("span",{className:"font-semibold",children:Math.min(ac+ad.length-1,L)})," of"," ",(0,b.jsx)("span",{className:"font-semibold",children:L})," entries"]}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsxs)("select",{value:J,onChange:a=>{K(parseInt(a.target.value)),I(1)},className:"pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white",children:[(0,b.jsx)("option",{value:5,children:"5 rows"}),(0,b.jsx)("option",{value:10,children:"10 rows"}),(0,b.jsx)("option",{value:25,children:"25 rows"}),(0,b.jsx)("option",{value:50,children:"50 rows"}),(0,b.jsx)("option",{value:100,children:"100 rows"})]}),(0,b.jsx)("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700",children:(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})})]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsxs)("button",{onClick:()=>ab(1),disabled:1===H,className:"p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,b.jsx)("span",{className:"sr-only",children:"First"}),(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M11 19l-7-7 7-7m8 14l-7-7 7-7"})})]}),(0,b.jsx)("button",{onClick:()=>ab(H-1),disabled:1===H,className:"px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Previous"}),Array.from({length:Math.min(5,N)},(a,c)=>{let d;return d=N<=5||H<=3?c+1:H>=N-2?N-4+c:H-2+c,(0,b.jsx)("button",{onClick:()=>ab(d),className:`px-3 py-1 rounded ${H===d?"bg-blue-600 text-white":"border border-gray-300 hover:bg-gray-50"}`,children:d},c)}),(0,b.jsx)("button",{onClick:()=>ab(H+1),disabled:H===N,className:"px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Next"}),(0,b.jsxs)("button",{onClick:()=>ab(N),disabled:H===N,className:"p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,b.jsx)("span",{className:"sr-only",children:"Last"}),(0,b.jsx)("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M13 5l7 7-7 7M5 5l7 7-7 7"})})]})]})]})]}),(0,b.jsx)("div",{className:`fixed inset-0 z-50 ${h||j?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,b.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-lg",children:(0,b.jsxs)("div",{className:"p-6",children:[(0,b.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:j?"Edit Breed":"Add New Breed"}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Breed Name *"}),(0,b.jsx)("input",{type:"text",value:p,onChange:a=>q(a.target.value),placeholder:"Enter breed name",className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",onKeyDown:a=>{"Enter"===a.key&&(j?Z():Y())},autoFocus:!0})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Sort Order"}),(0,b.jsx)("input",{type:"number",min:"0",value:r,onChange:a=>s(a.target.value),placeholder:"Enter sort order (optional)",className:"w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",onKeyDown:a=>{"Enter"===a.key&&(j?Z():Y())}}),(0,b.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Lower numbers appear first. Leave empty for automatic ordering."})]})]}),(0,b.jsxs)("div",{className:"flex justify-end gap-2 mt-6",children:[(0,b.jsx)("button",{onClick:()=>{i(!1),k(!1),q(""),s("")},className:"px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors",children:"Cancel"}),(0,b.jsx)("button",{onClick:j?Z:Y,disabled:!p.trim(),className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:j?"Save Changes":"Add Breed"})]})]})})}),(0,b.jsx)("div",{className:`fixed inset-0 z-50 ${l?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,b.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-md",children:(0,b.jsxs)("div",{className:"p-6 text-center",children:[(0,b.jsx)("div",{className:"text-red-500 text-5xl mb-4",children:"🗑️"}),(0,b.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Delete Breed?"}),(0,b.jsxs)("p",{className:"text-gray-600 mb-6",children:['Are you sure you want to delete "',x,'"? This action cannot be undone.']}),(0,b.jsxs)("div",{className:"flex justify-center gap-3",children:[(0,b.jsx)("button",{onClick:()=>{m(!1),w(null),y("")},className:"px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors",children:"Cancel"}),(0,b.jsx)("button",{onClick:$,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",children:"Delete"})]})]})})}),(0,b.jsx)("div",{className:`fixed inset-0 z-50 ${n?"flex":"hidden"} items-center justify-center p-4 bg-black/50`,children:(0,b.jsx)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-md",children:(0,b.jsxs)("div",{className:"p-6 text-center",children:[(0,b.jsx)("div",{className:"text-red-500 text-5xl mb-4",children:"🗑️"}),(0,b.jsx)("h2",{className:"text-xl font-semibold text-gray-800 mb-2",children:"Delete Selected Breeds?"}),(0,b.jsxs)("p",{className:"text-gray-600 mb-6",children:["Are you sure you want to delete ",f.filter(a=>a.selected).length," selected breed(s)? This action cannot be undone."]}),(0,b.jsxs)("div",{className:"flex justify-center gap-3",children:[(0,b.jsx)("button",{onClick:()=>o(!1),className:"px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded transition-colors",children:"Cancel"}),(0,b.jsxs)("button",{onClick:_,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",children:["Delete ",f.filter(a=>a.selected).length," Breeds"]})]})]})})})]})}a.s(["default",()=>e])}];

//# sourceMappingURL=aa57d_adminkisanpartner_app_%28options_settings%29_breed-options_page_tsx_7f06b6e6._.js.map