package com.peachgarden.app;

import android.content.ClipData;
import android.content.ClipDescription;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "ImageShare")
public class ImageSharePlugin extends Plugin {

    @PluginMethod
    public void shareImages(PluginCall call) {
        JSArray files = call.getArray("files");
        if (files == null || files.length() == 0) {
            call.reject("至少需要一张图片");
            return;
        }

        try {
            List<Object> fileList = files.toList();
            ArrayList<Uri> contentUris = new ArrayList<>();

            for (Object value : fileList) {
                Uri fileUri = Uri.parse((String) value);
                if (!"file".equals(fileUri.getScheme())) {
                    call.reject("只支持本地图片文件");
                    return;
                }

                File imageFile = new File(fileUri.getPath());
                if (!imageFile.exists() || !imageFile.getName().toLowerCase().endsWith(".png")) {
                    call.reject("分享文件不是有效的 PNG 图片");
                    return;
                }

                Uri contentUri = FileProvider.getUriForFile(
                    getActivity(),
                    getContext().getPackageName() + ".fileprovider",
                    imageFile
                );
                contentUris.add(contentUri);
            }

            Intent intent = new Intent(contentUris.size() > 1 ? Intent.ACTION_SEND_MULTIPLE : Intent.ACTION_SEND);
            intent.setType("image/png");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            String text = call.getString("text");
            if (text != null && !text.isBlank()) intent.putExtra(Intent.EXTRA_TEXT, text);

            String title = call.getString("title");
            if (title != null && !title.isBlank()) intent.putExtra(Intent.EXTRA_SUBJECT, title);

            String clipboardText = call.getString("clipboardText");
            if (clipboardText != null && !clipboardText.isBlank()) {
                Toast.makeText(
                    getContext(),
                    "标题和开篇背景已复制；小红书不自动接收文案时请粘贴",
                    Toast.LENGTH_LONG
                ).show();
            }

            ClipData clipData = new ClipData(
                new ClipDescription("中国故事分享图", new String[] { "image/png" }),
                new ClipData.Item(contentUris.get(0))
            );
            for (int index = 1; index < contentUris.size(); index++) {
                clipData.addItem(new ClipData.Item(contentUris.get(index)));
            }
            intent.setClipData(clipData);

            if (contentUris.size() > 1) {
                intent.putParcelableArrayListExtra(Intent.EXTRA_STREAM, contentUris);
            } else {
                intent.putExtra(Intent.EXTRA_STREAM, contentUris.get(0));
            }

            Intent chooser = Intent.createChooser(intent, call.getString("dialogTitle", "分享整套故事图片"));
            chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getActivity().startActivity(chooser);
            call.resolve();
        } catch (Exception error) {
            call.reject(error.getLocalizedMessage(), error);
        }
    }
}
