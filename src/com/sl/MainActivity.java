package com.sl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import com.sl.caipiao.R;
import com.sl.controller.Login;
import com.sl.ui.ColorPickerDialog;
import com.sl.ui.UIWebView;
import com.sl.ui.UpdateDialog;
import com.sl.util.BitmapTools;
import com.sl.util.FormFile;
import com.sl.util.HttpUtil;

import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.View.OnClickListener;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.view.animation.AnimationUtils;
import android.webkit.JsPromptResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebStorage;
import android.webkit.WebView;
import android.webkit.WebSettings.TextSize;
import android.widget.Button;
import android.widget.Toast;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

public class MainActivity extends Activity {

	private UIWebView webView;
	private String selectImageCallback;
	private String loginCallback;
	private Handler handler = new Handler();
	private static int RESULT_LOAD_IMAGE = 1;
	private static int RESULT_LOGIN = 2;
	private Login login;

	private SensorManager sensorManager;
	private Vibrator vibrator;

	private static final String TAG = "SensorActivity";
	private static final int SENSOR_SHAKE = 10;
	private UpdateDialog updateManage;

	private Handler threadHandler = new Handler() {

		@Override
		public void handleMessage(Message msg) {
			Bundle bundle = msg.getData();
			switch (msg.what) {
			case 0:
				webView.loadUrl("javascript:window.callbackfunctions."
						+ bundle.getString("callback") + "("
						+ bundle.getString("result") + ");");
				break;
			case SENSOR_SHAKE:
				webView.loadUrl("javascript:window.app_trigger('motion');");
				break;
			}
		}
	};

	private void setFullScreen() {
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
				WindowManager.LayoutParams.FLAG_FULLSCREEN);
	}

	private void cancelFullScreen() {
		getWindow().setFlags(
				WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN,
				WindowManager.LayoutParams.FLAG_FULLSCREEN);
	}

	private void tip(String msg) {
		Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
	}

	@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
	private void loadWebView() {

		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
			getWindow().setSoftInputMode(
					WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
		}

		webView = (UIWebView) this.findViewById(R.id.webview);

		WebSettings settings = webView.getSettings();

		settings.setCacheMode(WebSettings.LOAD_DEFAULT);

		settings.setJavaScriptEnabled(true);

		settings.setAllowFileAccess(true);
		settings.setDatabaseEnabled(true);
		String dir = this.getApplicationContext()
				.getDir("database", Context.MODE_PRIVATE).getPath();
		settings.setDatabasePath(dir);
		settings.setDomStorageEnabled(true);
		settings.setGeolocationEnabled(true);
		settings.setTextSize(TextSize.NORMAL);

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
			settings.setAllowFileAccessFromFileURLs(true);
			settings.setAllowUniversalAccessFromFileURLs(true);
		}

		registerForContextMenu(webView);

		webView.setVerticalScrollBarEnabled(false);
		webView.setHorizontalScrollBarEnabled(false);
		webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);

		webView.setWebChromeClient(new WebChromeClient() {

			public void onExceededDatabaseQuota(String url,
					String databaseIdentifier, long currentQuota,
					long estimatedSize, long totalUsedQuota,
					WebStorage.QuotaUpdater quotaUpdater) {
				quotaUpdater.updateQuota(50 * 1024 * 1024);
			}

			@Override
			public boolean onJsPrompt(WebView view, String url, String message,
					String defaultValue, JsPromptResult result) {

				try {
					JSONObject info = new JSONObject(message);

					String method = info.getString("method");
					String callback = info.has("callback") ? info
							.getString("callback") : null;

					result.confirm(null);

					if (method.equals("tip")) {

						Toast.makeText(MainActivity.this,
								info.getString("params"), Toast.LENGTH_LONG)
								.show();

					} else {

						Object params = info.has("params") ? info.get("params")
								: null;

						jsHandle(method, callback, params);

					}

				} catch (JSONException e) {
					e.printStackTrace();
				}

				return true;
			}

			@Override
			public void onProgressChanged(WebView view, int newProgress) {
				if (100 == newProgress) {
				}
				super.onProgressChanged(view, newProgress);
			}
		});

		webView.loadUrl("file:///android_asset/index.html");
	}

	private void js(final String func, final String param) {

		if (func != null)
			handler.post(new Runnable() {
				public void run() {

					Log.i("js", "javascript:window." + func + "(" + param
							+ ");");
					webView.loadUrl("javascript:window." + func + "(" + param
							+ ");");
				}
			});
	}

	private void jsCallback(String callback, String param) {
		js("callbackfunctions." + callback, param);
	}

	private void jsHandle(final String method, final String callback,
			final Object params) {

		if (method.equals("onload")) {
			onload(callback);

		} else if ("exit".equals(method)) {
			tip("退出");
			finish();
			System.exit(0);

		} else if ("getAppInfo".equals(method)) {

		} else if ("colorpicker".equals(method)) {
			ColorPickerDialog colorpicker = new ColorPickerDialog(this,
					0xFFFFFF, "选择背景色",
					new ColorPickerDialog.OnColorChangedListener() {

						@Override
						public void colorChanged(int color) {
							jsCallback(
									callback,
									"\""
											+ String.format("#%06X",
													(0xFFFFFF & color)) + "\"");
						}
					});
			colorpicker.show();

		} else if ("share".equals(method)) {
			Intent intent = new Intent(Intent.ACTION_SEND);
			intent.setType("text/plain");
			intent.putExtra(Intent.EXTRA_SUBJECT, "分享");
			intent.putExtra(Intent.EXTRA_TEXT, "分享");
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			startActivity(Intent.createChooser(intent, getTitle()));

		} else if ("login".equals(method)) {
			loginCallback = callback;

			loginButton.performClick();

			// Intent i = new Intent(MainActivity.this, LoginActivity.class);
			// startActivityForResult(i, RESULT_LOGIN);

			// login.start(callback);

		} else if ("selectimage".equals(method)) {
			selectImageCallback = callback;

			Intent i = new Intent(
					Intent.ACTION_PICK,
					android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);

			startActivityForResult(i, RESULT_LOAD_IMAGE);

		} else if ("updateApp".equals(method)) {
			Log.d("updateApp", "begin updateApp");
			JSONObject data = (JSONObject) params;
			// 检查软件更新
			try {
				updateManage.showNoticeDialog(data.getString("downloadUrl"),
						data.getString("versionName"));

			} catch (JSONException e) {
				e.printStackTrace();
			}

		} else {

			if ("post".equals(method)) {
				if (!HttpUtil.IsNetworkConnected(this)) {
					tip("网络连接已断开");
				}
			}

			new Thread() {
				@SuppressWarnings("rawtypes")
				@Override
				public void run() {
					Message msg = new Message();
					Bundle bundle = new Bundle();

					if (null != callback) {
						bundle.putString("callback", callback);
					}

					if ("post".equals(method)) {

						JSONObject data = (JSONObject) params;

						List<NameValuePair> postData = new ArrayList<NameValuePair>();
						List<FormFile> files = null;

						try {

							if (data.has("data") && !data.isNull("data")) {

								JSONObject postParams = data
										.getJSONObject("data");

								if (data != null)
									for (Iterator itr = postParams.keys(); itr
											.hasNext();) {

										String key = itr.next().toString();

										Log.d("post",
												key
														+ '='
														+ postParams
																.getString(key));

										postData.add(new BasicNameValuePair(
												key, postParams.getString(key)));
									}
							}

							if (data.has("files") && !data.isNull("files")) {

								JSONObject postFiles = data
										.getJSONObject("files");

								if (postFiles != null) {
									BitmapTools bitmapTools = BitmapTools
											.getInstance();

									files = new ArrayList<FormFile>();
									for (Iterator itr = postFiles.keys(); itr
											.hasNext();) {

										String key = itr.next().toString();

										if ("avatars".equals(key)) {
											String picturePath = postFiles
													.getString(key);

											Bitmap bitmap = bitmapTools
													.BitmapCrop(picturePath);

											bitmap = bitmapTools
													.CompressBitmap(bitmap,
															140, 140);

											Log.d("upload avatars", picturePath
													+ " " + key);

											files.add(new FormFile(
													"E:\\avatars.jpg", bitmap,
													key, "image/jpeg"));
										}
									}
								}

							}

							// Log.i("url", data.getString("url"));

							String result = HttpUtil.post(
									data.getString("url"), postData, files);

							// Log.i("result", result);

							bundle.putString("result", result);

						} catch (JSONException e) {
							e.printStackTrace();
						} catch (Exception e) {
							e.printStackTrace();
							tip("网络错误");
						}
					}

					msg.setData(bundle);
					msg.what = 0;

					threadHandler.sendMessage(msg);
				}
			}.start();

		}
	}

	private void onload(final String callback) {
		cancelFullScreen();

		Animation anim = AnimationUtils
				.loadAnimation(this, R.anim.push_left_in);

		webView.startAnimation(anim);

		anim.setAnimationListener(new AnimationListener() {

			@Override
			public void onAnimationEnd(Animation animation) {
				jsCallback(callback, null);
			}

			@Override
			public void onAnimationRepeat(Animation arg0) {
			}

			@Override
			public void onAnimationStart(Animation animation) {
			}
		});

		View viewSplash = this.findViewById(R.id.loading);
		viewSplash.startAnimation(AnimationUtils.loadAnimation(
				MainActivity.this, R.anim.push_left_out));
		viewSplash.setVisibility(View.GONE);
	}

	private Boolean created = false;
	private Button loginButton;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		this.findViewById(R.id.loading).setVisibility(View.VISIBLE);

		loginButton = (Button) this.findViewById(R.id.button1);
		loginButton.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				Intent i = new Intent(MainActivity.this, LoginActivity.class);
				startActivityForResult(i, RESULT_LOGIN);
			}

		});

		// setFullScreen();

		updateManage = new UpdateDialog(MainActivity.this);

		loadWebView();

		login = new Login(this, threadHandler);

		sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
		vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);

		// onload("");
	}

	@Override
	protected void onResume() {
		if (created) {
			webView.invalidate();
			webView.refreshDrawableState();
		} else {
			created = true;
		}
		super.onResume();

		if (sensorManager != null) {// 注册监听器
			sensorManager.registerListener(sensorEventListener,
					sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
					SensorManager.SENSOR_DELAY_NORMAL);
			// 第一个参数是Listener，第二个参数是所得传感器类型，第三个参数值获取传感器信息的频率
		}
	}

	@Override
	protected void onPause() {
		super.onPause();
		if (sensorManager != null) {// 取消监听器
			sensorManager.unregisterListener(sensorEventListener);
		}
	}

	/**
	 * 重力感应监听
	 */
	private SensorEventListener sensorEventListener = new SensorEventListener() {

		@Override
		public void onSensorChanged(SensorEvent event) {
			// 传感器信息改变时执行该方法
			float[] values = event.values;
			float x = values[0]; // x轴方向的重力加速度，向右为正
			float y = values[1]; // y轴方向的重力加速度，向前为正
			float z = values[2]; // z轴方向的重力加速度，向上为正
			Log.i(TAG, "x轴方向的重力加速度" + x + "；y轴方向的重力加速度" + y + "；z轴方向的重力加速度" + z);
			// 一般在这三个方向的重力加速度达到40就达到了摇晃手机的状态。
			int medumValue = 19;// 三星 i9250怎么晃都不会超过20，没办法，只设置19了
			if (Math.abs(x) > medumValue || Math.abs(y) > medumValue
					|| Math.abs(z) > medumValue) {
				// vibrator.vibrate(200);
				Message msg = new Message();
				msg.what = SENSOR_SHAKE;
				threadHandler.sendMessage(msg);
			}
		}

		@Override
		public void onAccuracyChanged(Sensor sensor, int accuracy) {

		}
	};

	@SuppressLint("NewApi")
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {

		super.onActivityResult(requestCode, resultCode, data);

		if (resultCode == RESULT_OK) {

			if (requestCode == RESULT_LOAD_IMAGE && null != data) {

				Uri selectedImage = data.getData();

				String[] filePathColumn = { MediaStore.Images.Media.DATA };

				Cursor cursor = getContentResolver().query(selectedImage,
						filePathColumn, null, null, null);

				cursor.moveToFirst();

				int columnIndex = cursor.getColumnIndex(filePathColumn[0]);

				String picturePath = cursor.getString(columnIndex);

				cursor.close();

				BitmapTools bitmapTools = BitmapTools.getInstance();

				Bitmap bitmap = bitmapTools.BitmapCrop(picturePath);

				Log.d("selectImage", picturePath + bitmap.getByteCount());

				Uri uri = Uri.parse(MediaStore.Images.Media.insertImage(
						getContentResolver(), bitmap, null, null));

				JSONObject json = new JSONObject();
				try {
					json.put("path", picturePath);
					json.put("src", uri.toString());

				} catch (JSONException e) {
					e.printStackTrace();
				}

				jsCallback(selectImageCallback, json.toString());

			} else if (requestCode == RESULT_LOGIN) {

				if ("false".equals(data.getStringExtra("success"))) {
					tip("登录失败！");
				} else {
					tip("登录成功！");

					data.getStringExtra("_ASPXCOOKIEWebApi");
					data.getStringExtra("ASP_NET_SessionId");
					data.getStringExtra("UserName");

					JSONObject json = new JSONObject();
					try {
						json.put(".ASPXCOOKIEWebApi",
								data.getStringExtra("_ASPXCOOKIEWebApi"));
						json.put("ASP.NET_SessionId",
								data.getStringExtra("ASP_NET_SessionId"));
						json.put("UserName", data.getStringExtra("UserName"));

					} catch (JSONException e) {
						e.printStackTrace();
					}

					jsCallback(loginCallback, json.toString());

				}

			}

		}
	}

	@Override
	public void onConfigurationChanged(Configuration newConfig) {

		Log.d("orientation",
				"orientation " + newConfig.orientation + " "
						+ webView.getMeasuredWidth() + ","
						+ webView.getMeasuredHeight());

		super.onConfigurationChanged(newConfig);
	}

	private long mExitTime = 0;

	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if ((keyCode == KeyEvent.KEYCODE_BACK)) {
			// webView.loadUrl("javascript:window.appBack();");

			if (webView.canGoBack()) {
				webView.goBack();

			} else {
				if ((System.currentTimeMillis() - mExitTime) > 2000) {
					Toast.makeText(this, "再按一次退出程序", Toast.LENGTH_SHORT).show();
					mExitTime = System.currentTimeMillis();
				} else {
					finish();
					System.exit(0);
				}
			}
			return true;
		}

		return super.onKeyDown(keyCode, event);
	}

}
