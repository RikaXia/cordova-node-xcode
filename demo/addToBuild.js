const xcode = require('../'),
    fs = require('fs');

let pbxproFile = "./project.pbxproj",
    proj = xcode.project(pbxproFile),
    // projData = proj.parseSync().hash.project.objects,
    upperGroupName,
    group;
proj.hash = proj.parseSync().hash;


// 得到地图的好的文件json数据
"Libraries/4399CoreChina.bundle/ssjjjm_account_add.png".split("/").slice(0,-1).forEach(item => {
    // 得到上级组名称
    upperGroupName = upperGroupName || "CustomTemplate";
    group = proj.pbxGroupByName(item);                      // 当前组
    upperGroup = proj.pbxGroupByName(upperGroupName);       // 上级组

    // 当前组不存在，则创建一组
    if(!group){
        group = proj.addPbxGroup([],undefined,item);
        upperGroup.children.push({value:group.uuid,comment:item});
    };
    upperGroupName = item;
});

let file = proj.addFile("Frameworks/Plugins/iOS/4399SDK/4399CoreChina.bundle/ssjjjm_account_add.png",group.uuid,{
    sourceTree:"SOURCE_ROOT",
    lastKnownFileType:"images.png"
});
file.uuid = proj.generateUuid();
proj.addToPbxBuildFileSection(file);
proj.addToPbxResourcesBuildPhase(file);

// 基本一样（未测试出什么问题）
proj.addBuildProperty("PRIVATE_HEADERS_FOLDER_PATH","online.app/PrivateHeaders");
proj.updateBuildProperty("PRIVATE_HEADERS_FOLDER_PATH","online.app/PrivateHeaders");


proj.addFramework("AdSupport.framework",{
    link:link,          // 默认true
    embed:true          // 默认false
});

// 在addFile晨指定group外，这样也可以往组中添加数据
// group.pbxGroup.children.push({value:file.uuid,comment:file.basename});


// 组对象
// let groupStr = JSON.stringify(proj.hash.project.objects['PBXGroup'],null,2);
// fs.writeFileSync('/Users/fan/Desktop/group.json',groupStr);

// 保存文件
fs.writeFileSync(pbxproFile,proj.writeSync());