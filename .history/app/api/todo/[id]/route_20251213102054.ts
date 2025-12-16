export async function DELETE(){
    connectDb()

     return NextResponse.json({
    success: true,
    message: "success",
  });

}

export async function PUT(){
    connectDb()

     return NextResponse.json({
    success: true,
    message: "success",
  });

}
