module.exports=[417063,a=>{"use strict";var b=a.i(282814),c=a.i(288216),d=a.i(998050),e=a.i(588548),f=a.i(230222),g=a.i(198411),h=a.i(80486),i=a.i(912860),j=a.i(571507),k=a.i(602637),l=a.i(337135),m=a.i(368860),n=a.i(64641),o=a.i(520533),p=a.i(153794),q=a.i(986732);function r(){let[a,r]=(0,c.useState)([]),[s,t]=(0,c.useState)([]),[u,v]=(0,c.useState)(""),[w,x]=(0,c.useState)(!1),[y,z]=(0,c.useState)(!0),[A,B]=(0,c.useState)(!1),[C,D]=(0,c.useState)(!1),[E,F]=(0,c.useState)(null),[G,H]=(0,c.useState)(""),[I,J]=(0,c.useState)(""),[K,L]=(0,c.useState)([]),[M,N]=(0,c.useState)(!1),[O,P]=(0,c.useState)(!1),[Q,R]=(0,c.useState)(!1),[S,T]=(0,c.useState)({id:null,name:""}),[U,V]=(0,c.useState)({total:0,page:1,limit:10,totalPages:1}),[W,X]=(0,c.useState)(""),Y=(0,c.useCallback)(async()=>{B(!0);try{let a=await n.default.get("/api/states",{params:{page:1,limit:100}});a.data.success&&t(a.data.data)}catch(a){console.error("Error fetching states:",a),m.default.error("Failed to load states")}finally{B(!1)}},[]),Z=(0,c.useCallback)(async(a=1,b="",c="",d)=>{x(!0);try{let e={page:a,limit:d||U.limit,search:b};c&&(e.stateId=c);let f=(await n.default.get("/api/districts",{params:e})).data;if(f.success){let a=f.data.map(a=>{let b="Unknown State";if(a.state&&a.state.name)b=a.state.name;else if(a.stateId){let c=s.find(b=>b._id===a.stateId);b=c?.name||"Unknown State"}return{...a,state:a.state||{_id:a.stateId,name:b},stateName:b,selected:!1}});r(a),V({total:f.pagination?.total||f.total||0,page:f.pagination?.page||f.page||1,limit:f.pagination?.limit||f.limit||d||U.limit,totalPages:f.pagination?.totalPages||Math.ceil((f.pagination?.total||f.total||0)/(f.pagination?.limit||f.limit||d||U.limit))}),L([]),N(!1)}}catch(a){console.error("Error fetching districts:",a),m.default.error(a.response?.data?.message||"Failed to fetch districts")}finally{x(!1),z(!1)}},[U.limit,s]),$=async()=>{try{if((await n.default.post("/api/districts",{name:G,stateId:I})).data.success)return m.default.success("District added successfully"),await Z(U.page,u,W),!0;return!1}catch(a){return m.default.error(a.response?.data?.message||"Failed to add district"),!1}},_=async a=>{try{if((await n.default.put(`/api/districts/${a}`,{name:G,stateId:I})).data.success)return m.default.success("District updated successfully"),await Z(U.page,u,W),!0;return!1}catch(a){return m.default.error(a.response?.data?.message||"Failed to update district"),!1}},aa=async b=>{x(!0);try{return await n.default.delete(`/api/districts/${b}`),m.default.success("District deleted successfully"),1===a.length&&U.page>1?await Z(U.page-1,u,W):await Z(U.page,u,W),!0}catch(a){return m.default.error(a.response?.data?.message||"Failed to delete district"),!1}finally{x(!1)}},ab=async b=>{x(!0);try{return await n.default.delete("/api/districts",{data:{ids:b}}),m.default.success(`${b.length} district(s) deleted successfully`),a.length===b.length&&U.page>1?await Z(U.page-1,u,W):await Z(U.page,u,W),!0}catch(a){return m.default.error(a.response?.data?.message||"Failed to delete districts"),!1}finally{x(!1)}};(0,c.useEffect)(()=>{Y()},[Y]),(0,c.useEffect)(()=>{s.length>0&&y&&Z(1,u,W)},[s,y]);let ac=(a,b)=>{b?L([...K,a]):(L(K.filter(b=>b!==a)),N(!1))},ad=a=>{F(a._id),H(a.name),J(a.stateId),D(!0)},ae=async()=>{G.trim()?I?(x(!0),(E?await _(E):await $())&&D(!1),x(!1)):m.default.error("Please select a state"):m.default.error("Please enter district name")},af=a=>{T({id:a._id,name:a.name}),P(!0)},ag=async()=>{S.id&&(await aa(S.id),P(!1),T({id:null,name:""}))},ah=async()=>{await ab(K),R(!1)},ai=async()=>{let b=a.length.toString().length+1,c=Math.max(8,...a.map(a=>a.name.length)),d=Math.max(5,...a.map(a=>a.stateName?.length||0)),e="No.".padEnd(b)+"	"+"District".padEnd(c)+"	"+"State".padEnd(d),f="-".repeat(b)+"	"+"-".repeat(c)+"	"+"-".repeat(d),g=a.map((a,e)=>(e+1).toString().padEnd(b)+"	"+a.name.padEnd(c)+"	"+(a.stateName||"").padEnd(d)).join("\n"),h=[...new Set(a.map(a=>a.stateName))].length,i=`

=== Summary ===
Total Districts: ${a.length}
Unique States: ${h}`,j=`${e}
${f}
${g}${i}`;try{await navigator.clipboard.writeText(j),m.default.success("Districts data with summary copied!")}catch(a){m.default.error("Failed to copy to clipboard")}},aj=()=>{if(0===a.length)return void m.default.error("No districts to export");try{let b=o.utils.json_to_sheet(a.map((a,b)=>({"Sr.":b+1+(U.page-1)*U.limit,"District Name":a.name,State:a.stateName,"Created At":a.createdAt?new Date(a.createdAt).toLocaleDateString():"N/A","Updated At":a.updatedAt?new Date(a.updatedAt).toLocaleDateString():"N/A"}))),c=o.utils.book_new();o.utils.book_append_sheet(c,b,"Districts"),o.writeFile(c,`districts-${new Date().toISOString().split("T")[0]}.xlsx`),m.default.success("Excel file exported successfully!")}catch(a){m.default.error("Failed to export Excel file")}},ak=()=>{if(0===a.length)return void m.default.error("No districts to export");try{let b=o.utils.json_to_sheet(a.map((a,b)=>({"Sr.":b+1+(U.page-1)*U.limit,"District Name":a.name,State:a.stateName}))),c=o.utils.sheet_to_csv(b),d=new Blob([c],{type:"text/csv;charset=utf-8;"}),e=document.createElement("a");e.href=URL.createObjectURL(d),e.download=`districts-${new Date().toISOString().split("T")[0]}.csv`,e.click(),m.default.success("CSV file exported successfully!")}catch(a){m.default.error("Failed to export CSV file")}},al=()=>{if(0===a.length)return void m.default.error("No districts to export");try{let b=new p.default;b.text("Districts Management Report",14,16);let c=a.map((a,b)=>[b+1+(U.page-1)*U.limit,a.name,a.stateName||"N/A"]);(0,q.default)(b,{head:[["Sr.","District Name","State"]],body:c,startY:20,styles:{fontSize:8},headStyles:{fillColor:[76,175,80]}}),b.save(`districts-${new Date().toISOString().split("T")[0]}.pdf`),m.default.success("PDF file exported successfully!")}catch(a){m.default.error("Failed to export PDF file")}},am=()=>{if(0===a.length)return void m.default.error("No districts to print");let b=window.open("","_blank","width=900,height=700");if(!b)return void m.default.error("Please allow popups to print");let c=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Districts Report</title>
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
          <h1>🗺️ Districts Management Report</h1>
          <div class="header-info">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <div class="header-info">Total Districts: ${U.total} | Showing: ${a.length} districts</div>
          <div class="header-info">Page: ${U.page} of ${U.totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>District Name</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            ${a.map((a,b)=>`
              <tr>
                <td>${b+1+(U.page-1)*U.limit}</td>
                <td><strong>${a.name}</strong></td>
                <td>${a.stateName||"N/A"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
          <p>\xa9 ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              if (confirm('Close print window?')) {
                window.close();
              }
            }, 100);
          };
        </script>
      </body>
      </html>
    `;b.document.write(c),b.document.close()};(0,c.useEffect)(()=>{let a=setTimeout(()=>{y||(Z(1,u,W),V(a=>({...a,page:1})))},500);return()=>clearTimeout(a)},[u,y]),(0,c.useEffect)(()=>{y||(Z(1,u,W),V(a=>({...a,page:1})))},[W,y]);let an=()=>{v(""),X(""),V(a=>({...a,page:1})),y||Z(1,"","")};return(0,b.jsxs)("div",{className:"p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen",children:[y&&(0,b.jsx)("div",{className:"min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"})}),(0,b.jsx)("div",{className:"mb-6 flex justify-between items-center",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl md:text-2xl font-bold text-gray-800",children:"Districts Management"}),(0,b.jsxs)("p",{className:"text-gray-600 mt-2",children:["Overview and detailed management of all districts. ",U.total," districts found."]})]})}),K.length>0&&(0,b.jsx)("div",{className:"mb-4 p-3 bg-red-50 border border-red-200 rounded-lg",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(d.FaCheck,{className:"text-red-600"}),(0,b.jsxs)("span",{className:"font-medium text-red-700",children:[K.length," district",1!==K.length?"s":""," selected"]})]}),(0,b.jsxs)("button",{onClick:()=>{0===K.length?m.default.error("No districts selected"):R(!0)},className:"flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors",children:[(0,b.jsx)(d.FaTrash,{className:"w-4 h-4"}),"Delete Selected"]})]})}),(0,b.jsx)("div",{className:"lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow mb-2",children:[{label:"Copy",icon:d.FaCopy,onClick:ai,color:"bg-gray-100 hover:bg-gray-200 text-gray-800"},{label:"Excel",icon:d.FaFileExcel,onClick:aj,color:"bg-green-100 hover:bg-green-200 text-green-800"},{label:"CSV",icon:d.FaFileCsv,onClick:ak,color:"bg-blue-100 hover:bg-blue-200 text-blue-800"},{label:"PDF",icon:d.FaFilePdf,onClick:al,color:"bg-red-100 hover:bg-red-200 text-red-800"},{label:"Print",icon:d.FaPrint,onClick:am,color:"bg-purple-100 hover:bg-purple-200 text-purple-800"}].map((a,c)=>(0,b.jsx)("button",{onClick:a.onClick,className:`flex items-center justify-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 ${a.color} font-medium`,children:(0,b.jsx)(a.icon,{size:14})},c))}),(0,b.jsx)("div",{className:"bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2",children:(0,b.jsxs)("div",{className:"gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full",children:[(0,b.jsx)("div",{className:"md:col-span-3",children:(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.FaSearch,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",size:14}),(0,b.jsx)("input",{type:"text",placeholder:"Search districts...",value:u,onChange:a=>v(a.target.value),className:"md:w-72 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"})]})}),(0,b.jsx)("div",{className:"md:col-span-3",children:(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.FaFilter,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",size:14}),(0,b.jsx)("select",{className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors",value:W,onChange:a=>X(a.target.value),disabled:A,children:A?(0,b.jsx)("option",{children:"Loading states..."}):0===s.length?(0,b.jsx)("option",{value:"",children:"No states available"}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("option",{value:"",children:"All States"}),s.map(a=>(0,b.jsx)("option",{value:a._id,children:a.name},a._id))]})})]})}),(0,b.jsx)("div",{className:"md:col-span-2",children:(0,b.jsxs)("button",{onClick:an,className:"w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2",children:[(0,b.jsx)(d.FaRedo,{size:14})," Reset"]})}),(0,b.jsx)("div",{className:"lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm",children:[{label:"Copy",icon:d.FaCopy,onClick:ai,color:"bg-gray-100 hover:bg-gray-200 text-gray-800"},{label:"Excel",icon:d.FaFileExcel,onClick:aj,color:"bg-green-100 hover:bg-green-200 text-green-800"},{label:"CSV",icon:d.FaFileCsv,onClick:ak,color:"bg-blue-100 hover:bg-blue-200 text-blue-800"},{label:"PDF",icon:d.FaFilePdf,onClick:al,color:"bg-red-100 hover:bg-red-200 text-red-800"},{label:"Print",icon:d.FaPrint,onClick:am,color:"bg-purple-100 hover:bg-purple-200 text-purple-800"}].map((a,c)=>(0,b.jsx)("button",{onClick:a.onClick,className:`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${a.color} font-medium`,children:(0,b.jsx)(a.icon,{size:14})},c))}),(0,b.jsx)("div",{className:"md:col-span-2",children:(0,b.jsxs)("button",{onClick:()=>{F(null),H(""),J(""),D(!0)},className:"w-full px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2",children:[(0,b.jsx)(d.FaPlus,{size:14})," Add District"]})})]})}),!y&&a.length>0&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"hidden lg:block bg-white rounded shadow",children:(0,b.jsxs)("table",{className:"min-w-full",children:[(0,b.jsx)("thead",{className:"border-b border-zinc-200",children:(0,b.jsxs)("tr",{className:"*:text-zinc-800",children:[(0,b.jsx)("th",{className:"p-[.6rem] text-sm text-left font-semibold w-10",children:(0,b.jsx)("input",{type:"checkbox",checked:M,onChange:b=>{b.target.checked?(L(a.map(a=>a._id)),N(!0)):(L([]),N(!1))},className:"rounded border-gray-300"})}),(0,b.jsx)("th",{className:"p-[.6rem] text-sm text-left font-semibold",children:"Sr."}),(0,b.jsx)("th",{className:"p-[.6rem] text-sm text-left font-semibold",children:"District Name"}),(0,b.jsx)("th",{className:"p-[.6rem] text-sm text-left font-semibold",children:"State"}),(0,b.jsx)("th",{className:"p-[.6rem] text-sm text-left font-semibold",children:"Created At"}),(0,b.jsx)("th",{className:"p-[.6rem] text-sm text-left font-semibold",children:"Updated At"}),(0,b.jsx)("th",{className:"p-[.6rem] text-sm text-left font-semibold",children:"Actions"})]})}),(0,b.jsx)("tbody",{className:"divide-y divide-gray-100",children:a.map((a,c)=>(0,b.jsxs)("tr",{className:"hover:bg-gray-50 transition-colors",children:[(0,b.jsx)("td",{className:"p-[.6rem] text-sm",children:(0,b.jsx)("input",{type:"checkbox",checked:K.includes(a._id),onChange:b=>ac(a._id,b.target.checked),className:"rounded border-gray-300"})}),(0,b.jsx)("td",{className:"p-[.6rem] text-sm text-center",children:c+1+(U.page-1)*U.limit}),(0,b.jsx)("td",{className:"p-[.6rem] text-sm",children:(0,b.jsx)("div",{className:"font-semibold",children:a.name})}),(0,b.jsx)("td",{className:"p-[.6rem] text-sm",children:(0,b.jsx)("div",{className:"text-gray-700",children:a.stateName||"N/A"})}),(0,b.jsx)("td",{className:"p-[.6rem] text-sm text-gray-600",children:a.createdAt?new Date(a.createdAt).toLocaleDateString():"N/A"}),(0,b.jsx)("td",{className:"p-[.6rem] text-sm text-gray-600",children:a.updatedAt?new Date(a.updatedAt).toLocaleDateString():"N/A"}),(0,b.jsx)("td",{className:"p-[.6rem] text-sm",children:(0,b.jsxs)("div",{className:"flex gap-[.6rem] text-sm",children:[(0,b.jsx)("button",{onClick:()=>ad(a),className:"p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors",title:"Edit District",children:(0,b.jsx)(d.FaEdit,{size:14})}),(0,b.jsx)("button",{onClick:()=>af(a),className:"p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors",title:"Delete District",children:(0,b.jsx)(d.FaTrash,{size:14})})]})})]},a._id))})]})}),(0,b.jsx)("div",{className:"lg:hidden space-y-2 p-[.2rem] text-sm",children:a.map((a,c)=>(0,b.jsxs)("div",{className:"rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow",children:[(0,b.jsxs)("div",{className:"flex justify-between items-start mb-3",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("input",{type:"checkbox",checked:K.includes(a._id),onChange:b=>ac(a._id,b.target.checked),className:"rounded border-gray-300"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"font-bold text-gray-800",children:a.name}),(0,b.jsxs)("div",{className:"text-xs text-gray-500",children:["Sr. ",c+1+(U.page-1)*U.limit]})]})]}),(0,b.jsxs)("div",{className:"flex gap-[.6rem] text-sm",children:[(0,b.jsx)("button",{onClick:()=>ad(a),className:"p-1.5 text-blue-600",children:(0,b.jsx)(d.FaEdit,{size:14})}),(0,b.jsx)("button",{onClick:()=>af(a),className:"p-1.5 text-red-600",children:(0,b.jsx)(d.FaTrash,{size:14})})]})]}),(0,b.jsxs)("div",{className:"space-y-2 text-xs",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-xs text-gray-500",children:"State"}),(0,b.jsx)("div",{className:"text-xs font-medium",children:a.stateName||"N/A"})]}),(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-[.6rem] text-sm",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-xs text-gray-500",children:"Created At"}),(0,b.jsx)("div",{className:"text-xs",children:a.createdAt?new Date(a.createdAt).toLocaleDateString():"N/A"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"text-xs text-gray-500",children:"Updated At"}),(0,b.jsx)("div",{className:"text-xs",children:a.updatedAt?new Date(a.updatedAt).toLocaleDateString():"N/A"})]})]})]})]},a._id))})]}),!y&&0===a.length&&(0,b.jsxs)("div",{className:"text-center py-12",children:[(0,b.jsx)("div",{className:"text-gray-400 text-6xl mb-4",children:"🗺️"}),(0,b.jsx)("h3",{className:"text-xl font-semibold mb-2",children:"No districts found"}),(0,b.jsx)("p",{className:"text-gray-500",children:u?`No districts matching "${u}" found`:W?"No districts found for selected state":"Try adjusting your search or filters"}),(0,b.jsx)("button",{onClick:an,className:"mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors",children:"Reset Filters"})]}),!y&&a.length>0&&(0,b.jsxs)("div",{className:"flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm",children:[(0,b.jsxs)("div",{className:"text-gray-600",children:["Showing ",(0,b.jsxs)("span",{className:"font-semibold",children:[1+(U.page-1)*U.limit,"-",Math.min(U.page*U.limit,U.total)]})," of"," ",(0,b.jsx)("span",{className:"font-semibold",children:U.total})," districts",(0,b.jsx)("select",{value:U.limit,onChange:a=>{let b=Number(a.target.value);V(a=>({...a,limit:b,page:1})),Z(1,u,W,b)},className:"p-1 ml-3 border border-zinc-300 rounded",children:[5,10,20,50,100].map(a=>(0,b.jsx)("option",{value:a,children:a},a))})]}),(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsxs)("div",{className:"text-sm text-gray-600",children:["Page ",U.page," of ",U.totalPages]}),(0,b.jsx)(f.default,{count:U.totalPages,page:U.page,onChange:(a,b)=>{V(a=>({...a,page:b})),Z(b,u,W)},color:"primary",shape:"rounded",showFirstButton:!0,showLastButton:!0,siblingCount:1,boundaryCount:1})]})]}),C&&(0,b.jsx)("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm",children:(0,b.jsxs)("div",{className:"bg-white p-6 rounded-xl w-full max-w-md shadow-2xl",children:[(0,b.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,b.jsx)("h2",{className:"font-semibold text-xl text-gray-800",children:E?"Edit District":"Add New District"}),(0,b.jsx)("button",{onClick:()=>D(!1),className:"text-gray-500 hover:text-gray-700 text-xl",children:(0,b.jsx)(e.MdClose,{size:24})})]}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"District Name *"}),(0,b.jsx)("input",{type:"text",value:G,onChange:a=>H(a.target.value),onKeyPress:a=>"Enter"===a.key&&ae(),className:"w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500",placeholder:"Enter district name",autoFocus:!0})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"State *"}),(0,b.jsxs)("select",{className:"w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500",value:I,onChange:a=>J(a.target.value),disabled:A,children:[(0,b.jsx)("option",{value:"",children:"Select a state"}),s.map(a=>(0,b.jsx)("option",{value:a._id,children:a.name},a._id))]})]})]}),(0,b.jsxs)("div",{className:"flex justify-end gap-3 mt-6",children:[(0,b.jsx)("button",{onClick:()=>D(!1),className:"px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors",disabled:w,children:"Cancel"}),(0,b.jsx)("button",{onClick:ae,className:"px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors",disabled:w,children:w?"Saving...":E?"Update":"Add District"})]})]})}),(0,b.jsxs)(g.default,{open:O,onClose:()=>P(!1),"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description",children:[(0,b.jsx)(h.default,{id:"alert-dialog-title",className:"font-semibold",children:"Delete District?"}),(0,b.jsx)(i.default,{children:(0,b.jsxs)(j.default,{id:"alert-dialog-description",children:['Are you sure you want to delete the district "',S.name,'"? This action cannot be undone.']})}),(0,b.jsxs)(k.default,{children:[(0,b.jsx)(l.default,{onClick:()=>P(!1),color:"primary",children:"Cancel"}),(0,b.jsx)(l.default,{onClick:ag,color:"error",variant:"contained",autoFocus:!0,children:"Delete"})]})]}),(0,b.jsxs)(g.default,{open:Q,onClose:()=>R(!1),"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description",children:[(0,b.jsx)(h.default,{id:"alert-dialog-title",className:"font-semibold",children:"Delete Selected Districts?"}),(0,b.jsx)(i.default,{children:(0,b.jsxs)(j.default,{id:"alert-dialog-description",children:["Are you sure you want to delete ",K.length," selected district(s)? This action cannot be undone."]})}),(0,b.jsxs)(k.default,{children:[(0,b.jsx)(l.default,{onClick:()=>R(!1),color:"primary",children:"Cancel"}),(0,b.jsxs)(l.default,{onClick:ah,color:"error",variant:"contained",autoFocus:!0,children:["Delete (",K.length,")"]})]})]})]})}a.s(["default",()=>r])}];

//# sourceMappingURL=6c7f9_adminkisanpartner-1_adminkisanpartner_app_%28users%29_district_page_tsx_5cb8b7ee._.js.map