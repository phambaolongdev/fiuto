// ============================================================
// Locket Remote Config Rewrite
// Dùng cho: Loon / Quantumult X / Surge / Shadowrocket
// cre phambaolong
// ============================================================

(function() {
    const hasResponse = typeof $response !== "undefined" && $response !== null;
    const hasRequest = typeof $request !== "undefined" && $request !== null;
    const url = (hasRequest && $request.url) ? $request.url : (hasResponse && $response.url ? $response.url : "");

    // Helper: Giải mã Base64 an toàn trên mọi JavaScript Runtime
    function decodeBase64Safe(b64) {
        if (typeof atob !== "undefined") {
            try {
                return decodeURIComponent(escape(atob(b64)));
            } catch (_) {}
        }
        if (typeof Buffer !== "undefined") {
            try {
                return Buffer.from(b64, "base64").toString("utf-8");
            } catch (_) {}
        }
        try {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            let str = String(b64).replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
            let output = "";
            for (let bc = 0, bs, buffer, idx = 0; buffer = str.charAt(idx++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
                buffer = chars.indexOf(buffer);
            }
            return decodeURIComponent(escape(output));
        } catch (_) {
            return "";
        }
    }

    // Helper: Giải mã UID từ header Authorization (JWT Token Firebase)
    function extractUidFromAuthHeader(authHeader) {
        if (!authHeader || typeof authHeader !== "string") return "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        const parts = token.split(".");
        if (parts.length >= 2) {
            try {
                let base64Url = parts[1];
                let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                while (base64.length % 4) base64 += "=";
                let jsonPayload = decodeBase64Safe(base64);
                if (jsonPayload) {
                    const payload = JSON.parse(jsonPayload);
                    return String(payload.user_id || payload.sub || payload.uid || "").trim();
                }
            } catch (_) {}
        }
        return "";
    }

    // Tự động trích xuất và ghi nhớ UID nếu có Authorization header
    if (hasRequest && $request && $request.headers) {
        const reqAuth = $request.headers["Authorization"] || $request.headers["authorization"] || "";
        const extractedUid = extractUidFromAuthHeader(reqAuth);
        if (extractedUid && !extractedUid.startsWith("$RCAnonymousID") && typeof $persistentStore !== "undefined") {
            $persistentStore.write(extractedUid, "shadow_locket_uid");
        }
    }

    // 0. Manual test mode trên Shadowrocket
    if (!hasResponse && url && url.includes("raw.githubusercontent.com")) {
        if (typeof $done !== "undefined") {
            $done({
                response: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        "status": "success",
                        "module": "locketpbl",
                        "version": "9.0",
                        "author": "Phạm Bảo Long",
                        "message": "Module Locket Gold & Filter VIP v9.0 đồng bộ 100% hệ thống DNS VPS hoạt động hoàn hảo!"
                    })
                }
            });
        }
        return;
    }

    // BẢO VỆ TUYỆT ĐỐI VÀ CHUYỂN TIẾP TRỰC TIẾP TOÀN BỘ CLOUDFUNCTIONS VỀ MÁY CHỦ VPS
    // Kế thừa 100% nguyên bản cơ chế DNS: VPS 163.223.9.98 tự xử lý toàn bộ postMomentV2, generateFilteredImage, tải ảnh kết quả /ai-filters/,
    // không chạy qua trung gian JS để triệt tiêu vĩnh viễn lỗi mất mạng khi upload ảnh và lỗi không thể áp dụng bộ lọc.
    if (url.includes("cloudfunctions.net") && !url.includes("163.223.9.98")) {
        const newUrl = url.replace(/https?:\/\/us-central1-locket-4252a\.cloudfunctions\.net/i, "https://163.223.9.98");
        $done({
            url: newUrl
        });
        return;
    }

    // Cấu hình thông báo Chống Scam & Chúc mừng Lên Gold DÀNH RIÊNG CHO SHADOWROCKET (PHẠM BẢO LONG)
    const CUSTOM_POPUP_CONFIG = {
        "tag": "LOCKET GOLD PBL",
        "tag_gradient": true,
        "tag_style": "gold_gradient",
        "title": "Cảm ơn đã ủng hộ PBL💛",
        "feature_set": [{
            "title": "Nếu có thể hãy giới thiệu bạn bè ủng hộ mình nha ✨",
            "body": "Sự tin tưởng của bạn là cả niềm vui đối với mình 💛",
            "imageURL": "https://phambaolongdev.github.io/assets/img/thankyou1.png"
        }],
        "primary_button_title": "Vào Dùng Ngay",
        "campaign": "locket_gold_welcome_shadow",
        "start_at": "2020-01-01T00:00:00",
        "end_at": "2099-12-31T23:59:59",
        "use_local_time_zone": true
    };

    const CUSTOM_CAMERA_FILTER_CONFIG = {
        "allows_custom_filters": true,
        "allowsCustomFilters": true,
        "show_filter_button": true,
        "showFilterButton": true,
        "reference_image_attachment_enabled": true,
        "referenceImageAttachmentEnabled": true,
        "sheet_enabled": true,
        "sheetEnabled": true,
        "open_sheet_immediately": true,
        "openSheetImmediately": true,
        "sheet_filters": [{
            "title": {
                "en": "Hiệu Ứng AI 3D Hot 🔥",
                "vi": "Hiệu Ứng AI 3D Hot 🔥"
            },
            "filter_ids": ["stk_tai_tho", "stk_mu_ngu_khoc", "stk_jollibee", "stk_nak_ve_than", "stk_gojo_satoru", "stk_shopee_food"]
        }, {
            "title": {
                "en": "Photobooth 📸",
                "vi": "Photobooth 📸"
            },
            "filter_ids": ["pb_cortis_4cut", "pb_cortis_v1", "pb_cortis_v2", "pb_denim_ripped_2x2", "pb_ech_xanh", "pb_galaxy", "pb_holo_4cut", "pb_meo_dang_yeu_4cut", "pb_photobooth_hello_kitty", "pb_ripped_paper_4cut", "pb_scrapbook_ripped_4cut", "pb_shinchan_4cut", "pb_single_denim_ripped", "pb_single_film_nostalgia", "pb_single_y2k_silver_holo", "pb_strawberry", "pb_supperman_4cut", "pb_trung_bac_thao", "pb_vien_hello_kitty", "pb_vintage", "photobooth_4cut", "photobooth_cute"]
        }, {
            "title": {
                "en": "Khung Viền 🖼️",
                "vi": "Khung Viền 🖼️"
            },
            "filter_ids": ["frame_ba_khi", "khung_anh_o_kitty_v_sao", "khung_doraemon_shinchan_kitty", "khung_hello_kitty_h_ng_pastel", "khung_hello_kitty_pastel_ng_t_ng_o", "khung_kh_ng_gian_xanh_pastel", "khung_nh_hoa_pastel_vi_n_xanh_m_nh", "khung_nh_n_pastel_vi_n_ren", "khung_nh_pastel_vi_n_s_h_i_c_u", "khung_nh_shin_chan_vi_n_m_nh", "khung_nh_vu_ng_m_ng_nh_n_b_c", "khung_vu_ng_ng_i_sao_h_ng_pastel", "khung_xanh_v_tay_sao_v_ng"]
        }, {
            "title": {
                "en": "Trò Chơi Locket",
                "vi": "Trò Chơi Locket"
            },
            "filter_ids": ["hom_nay_an_gi"]
        }, {
            "title": {
                "en": "Goofy",
                "vi": "Hài hước"
            },
            "filter_ids": ["okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows"]
        }, {
            "title": {
                "en": "Looks",
                "vi": "Ngoại hình"
            },
            "filter_ids": ["bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces", "bye_brows"]
        }, {
            "title": {
                "en": "Celebrate",
                "vi": "Tiệc tùng"
            },
            "filter_ids": ["slimed", "princess", "disco_lights", "cash_money", "happy_birthday"]
        }, {
            "title": {
                "en": "Cute",
                "vi": "Đáng yêu"
            },
            "filter_ids": ["cutesy", "sticker_face", "flower_crown", "love_bug"]
        }, {
            "title": {
                "en": "Costumes",
                "vi": "Trang phục"
            },
            "filter_ids": ["wedding", "cowboy_cowgirl", "giraffe", "clown"]
        }, {
            "title": {
                "en": "Holidays",
                "vi": "Lễ hội"
            },
            "filter_ids": ["easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"]
        }],
        "sheetFilters": [{
            "title": {
                "en": "Hiệu Ứng AI 3D Hot 🔥",
                "vi": "Hiệu Ứng AI 3D Hot 🔥"
            },
            "filter_ids": ["stk_tai_tho", "stk_mu_ngu_khoc", "stk_jollibee", "stk_nak_ve_than", "stk_gojo_satoru", "stk_shopee_food"]
        }, {
            "title": {
                "en": "Photobooth 📸",
                "vi": "Photobooth 📸"
            },
            "filter_ids": ["pb_cortis_4cut", "pb_cortis_v1", "pb_cortis_v2", "pb_denim_ripped_2x2", "pb_ech_xanh", "pb_galaxy", "pb_holo_4cut", "pb_meo_dang_yeu_4cut", "pb_photobooth_hello_kitty", "pb_ripped_paper_4cut", "pb_scrapbook_ripped_4cut", "pb_shinchan_4cut", "pb_single_denim_ripped", "pb_single_film_nostalgia", "pb_single_y2k_silver_holo", "pb_strawberry", "pb_supperman_4cut", "pb_trung_bac_thao", "pb_vien_hello_kitty", "pb_vintage", "photobooth_4cut", "photobooth_cute"]
        }, {
            "title": {
                "en": "Khung Viền 🖼️",
                "vi": "Khung Viền 🖼️"
            },
            "filter_ids": ["frame_ba_khi", "khung_anh_o_kitty_v_sao", "khung_doraemon_shinchan_kitty", "khung_hello_kitty_h_ng_pastel", "khung_hello_kitty_pastel_ng_t_ng_o", "khung_kh_ng_gian_xanh_pastel", "khung_nh_hoa_pastel_vi_n_xanh_m_nh", "khung_nh_n_pastel_vi_n_ren", "khung_nh_pastel_vi_n_s_h_i_c_u", "khung_nh_shin_chan_vi_n_m_nh", "khung_nh_vu_ng_m_ng_nh_n_b_c", "khung_vu_ng_ng_i_sao_h_ng_pastel", "khung_xanh_v_tay_sao_v_ng"]
        }, {
            "title": {
                "en": "Trò Chơi Locket",
                "vi": "Trò Chơi Locket"
            },
            "filter_ids": ["hom_nay_an_gi"]
        }, {
            "title": {
                "en": "Goofy",
                "vi": "Hài hước"
            },
            "filter_ids": ["okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows"]
        }, {
            "title": {
                "en": "Looks",
                "vi": "Ngoại hình"
            },
            "filter_ids": ["bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces", "bye_brows"]
        }, {
            "title": {
                "en": "Celebrate",
                "vi": "Tiệc tùng"
            },
            "filter_ids": ["slimed", "princess", "disco_lights", "cash_money", "happy_birthday"]
        }, {
            "title": {
                "en": "Cute",
                "vi": "Đáng yêu"
            },
            "filter_ids": ["cutesy", "sticker_face", "flower_crown", "love_bug"]
        }, {
            "title": {
                "en": "Costumes",
                "vi": "Trang phục"
            },
            "filter_ids": ["wedding", "cowboy_cowgirl", "giraffe", "clown"]
        }, {
            "title": {
                "en": "Holidays",
                "vi": "Lễ hội"
            },
            "filter_ids": ["easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"]
        }],
        "picker_filters": ["pb_cortis_4cut", "pb_cortis_v1", "pb_cortis_v2", "pb_denim_ripped_2x2", "pb_ech_xanh", "pb_galaxy", "pb_holo_4cut", "pb_meo_dang_yeu_4cut", "pb_photobooth_hello_kitty", "pb_ripped_paper_4cut", "pb_scrapbook_ripped_4cut", "pb_shinchan_4cut", "pb_single_denim_ripped", "pb_single_film_nostalgia", "pb_single_y2k_silver_holo", "pb_strawberry", "pb_supperman_4cut", "pb_trung_bac_thao", "pb_vien_hello_kitty", "pb_vintage", "photobooth_4cut", "photobooth_cute", "frame_ba_khi", "khung_anh_o_kitty_v_sao", "khung_doraemon_shinchan_kitty", "khung_hello_kitty_h_ng_pastel", "khung_hello_kitty_pastel_ng_t_ng_o", "khung_kh_ng_gian_xanh_pastel", "khung_nh_hoa_pastel_vi_n_xanh_m_nh", "khung_nh_n_pastel_vi_n_ren", "khung_nh_pastel_vi_n_s_h_i_c_u", "khung_nh_shin_chan_vi_n_m_nh", "khung_nh_vu_ng_m_ng_nh_n_b_c", "khung_vu_ng_ng_i_sao_h_ng_pastel", "khung_xanh_v_tay_sao_v_ng", "stk_tai_tho", "stk_mu_ngu_khoc", "stk_jollibee", "stk_nak_ve_than", "stk_gojo_satoru", "stk_shopee_food", "hom_nay_an_gi", "okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows", "bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces", "slimed", "princess", "disco_lights", "cash_money", "happy_birthday", "cutesy", "sticker_face", "flower_crown", "love_bug", "wedding", "cowboy_cowgirl", "giraffe", "clown", "easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"],
        "pickerFilters": ["pb_cortis_4cut", "pb_cortis_v1", "pb_cortis_v2", "pb_denim_ripped_2x2", "pb_ech_xanh", "pb_galaxy", "pb_holo_4cut", "pb_meo_dang_yeu_4cut", "pb_photobooth_hello_kitty", "pb_ripped_paper_4cut", "pb_scrapbook_ripped_4cut", "pb_shinchan_4cut", "pb_single_denim_ripped", "pb_single_film_nostalgia", "pb_single_y2k_silver_holo", "pb_strawberry", "pb_supperman_4cut", "pb_trung_bac_thao", "pb_vien_hello_kitty", "pb_vintage", "photobooth_4cut", "photobooth_cute", "frame_ba_khi", "khung_anh_o_kitty_v_sao", "khung_doraemon_shinchan_kitty", "khung_hello_kitty_h_ng_pastel", "khung_hello_kitty_pastel_ng_t_ng_o", "khung_kh_ng_gian_xanh_pastel", "khung_nh_hoa_pastel_vi_n_xanh_m_nh", "khung_nh_n_pastel_vi_n_ren", "khung_nh_pastel_vi_n_s_h_i_c_u", "khung_nh_shin_chan_vi_n_m_nh", "khung_nh_vu_ng_m_ng_nh_n_b_c", "khung_vu_ng_ng_i_sao_h_ng_pastel", "khung_xanh_v_tay_sao_v_ng", "stk_tai_tho", "stk_mu_ngu_khoc", "stk_jollibee", "stk_nak_ve_than", "stk_gojo_satoru", "stk_shopee_food", "hom_nay_an_gi", "okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows", "bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces", "slimed", "princess", "disco_lights", "cash_money", "happy_birthday", "cutesy", "sticker_face", "flower_crown", "love_bug", "wedding", "cowboy_cowgirl", "giraffe", "clown", "easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"],
        "remote_filters": [{
            "uid": "stk_tai_tho",
            "id": "stk_tai_tho",
            "name": "Bờm Tai Thỏ 🐰",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Keep the person's exact face, expression, pose, and background from the photo, and realistically place a cute fluffy white and soft pink plush bunny ears headband sitting naturally on top of their head with matching soft lighting and natural shadows. If there are multiple people, put a matching bunny ears headband on each person cleanly.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "tintColor": "#FFB6C1",
            "colors": ["#FFB6C1", "#FF69B4"],
            "captureButtonColors": ["#FFB6C1", "#FF69B4"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🐰"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_mu_ngu_khoc",
            "id": "stk_mu_ngu_khoc",
            "name": "Mũ Ngủ Khóc Nhè 😭",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Apply the exact cartoon face filter from the reference image to the person's face.\n\n**FILTER ELEMENTS:**\n1. A cream-colored pixel-art sleeping hat with thick black pixel outlines and a light cyan fluffy pom-pom on the left side.\n2. Large, thin, perfectly round black wire-frame glasses positioned over both eyes. Keep both circular lenses clearly visible and symmetrical.\n3. Two exaggerated glossy cyan-blue anime crying streams extending outward from the inner corners of both eyes, with small floating water droplets.\n4. A tiny black spiral doodle on the nose.\n5. Two small curved black whisker-like lines on each cheek.\n\n**FACE BEAUTIFICATION:**\n- Make the face slightly smaller and slimmer.\n- Gently reduce cheek width.\n- Create a naturally slim V-shaped jawline.\n- Keep the face proportions realistic and symmetrical.\n- Do not distort the eyes, nose, mouth, or facial identity.\n\n**IMPORTANT REQUIREMENTS:**\n- Precisely align the hat, glasses, tears, nose doodle, and cheek details with the person's facial features.\n- The glasses MUST be included and clearly visible.\n- Preserve the original person's identity, hairstyle, clothing, pose, and background.\n- Use a combination of cute 8-bit pixel art and glossy 3D cartoon effects.\n- High-quality, clean edges, realistic face tracking, polished selfie filter aesthetic.\n- Do not add extra accessories or text.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "tintColor": "#67E8F9",
            "colors": ["#67E8F9", "#FEF3C7"],
            "captureButtonColors": ["#67E8F9", "#FEF3C7"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "😭"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_jollibee",
            "id": "stk_jollibee",
            "name": "Nhân Viên Jollibee 🐝",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the uploaded photograph. Keep the exact same person from the original image.\n\nChange ONLY the person's clothing into a realistic Jollibee restaurant employee uniform, as if the person is genuinely wearing it in a real photograph.\n\n**JOLLIBEE UNIFORM:**\n- A bright red short-sleeved polo shirt.\n- Yellow panels running along both shoulders and sleeves.\n- Blue and yellow striped collar.\n- Authentic Jollibee bee mascot logo embroidered on the left chest.\n- A small employee name tag on the right chest.\n- Dark navy blue waist apron with the Jollibee logo and branding.\n- Matching dark navy trousers.\n\n**REALISTIC CLOTHING DETAILS:**\n- Make the uniform fit naturally on the person's actual body.\n- Realistic fabric texture, stitching, wrinkles and folds.\n- Natural interaction between the clothing and the person's arms, shoulders and body.\n- The shirt and apron must look physically worn, not digitally pasted onto the person.\n\n**PRESERVE THE ORIGINAL PHOTO:**\n- Keep the person's original face, identity, hairstyle, skin tone and facial expression exactly unchanged.\n- Keep the original body shape, pose, hands and proportions.\n- Keep the original background, lighting, camera angle and image composition.\n- Do not change the person's age or facial features.\n\n**FINAL RESULT:**\nUltra-photorealistic real-life photograph, indistinguishable from an actual photo of the same person wearing a Jollibee employee uniform at the time the original photo was taken.\n\nNo sticker, no cartoon, no illustration, no white outline, no cutout, no transparent background, no 3D rendering.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "tintColor": "#E31837",
            "colors": ["#E31837", "#FFC72C"],
            "captureButtonColors": ["#E31837", "#FFC72C"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🐝"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_nak_ve_than",
            "id": "stk_nak_ve_than",
            "name": "Nak Vệ Thần ⚔️",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Transform the person in the uploaded photograph into a photorealistic real-life cosplay version of Nakroth – Dimensional Guardian from Arena of Valor.\nIMPORTANT: Create the hairstyle and costume entirely from the written description below. Do not require or rely on any additional reference images.\nHAIRSTYLE – SIGNATURE SILVER-WHITE HAIR\nReplace the person's original hairstyle with an elaborate silver-white hairstyle inspired by Nakroth's iconic in-game appearance.\n- Bright metallic silver-white hair.\n- Extremely voluminous, spiky and layered hairstyle.\n- Multiple large, sharp, outward-swept hair spikes on the top and both sides of the head.\n- Distinctive middle-parted hairstyle, with hair naturally divided into two sections.\n- Long, flowing side locks on BOTH sides of the face, extending down to the shoulders.\n- Two clearly visible long sections framing the cheeks and neck.\n- Additional layered strands flowing behind both ears.\n- Slightly messy, dynamic, luxurious anime-inspired hairstyle recreated with realistic human hair.\n- Every strand must look natural, detailed and physically realistic.\n- Do not make the hair short, flat, straight or a simple long wig.\nCOSTUME – NAKROTH DIMENSIONAL GUARDIAN\nReplace the person's original outfit with the complete signature costume:\n- Cropped black fitted blazer with a structured fashion silhouette.\n- Thin, elegant white piping outlining the blazer's lapels, front edges and pockets.\n- White dress shirt underneath.\n- Deep royal-blue necktie.\n- A distinctive metallic GOLD FOUR-POINT STAR ORNAMENT positioned at the tie knot. It must have four clearly defined pointed ends, NOT a triangle.\n- Light lavender-blue tailored trousers.\n- Black belt with a metallic buckle.\n- Decorative silver chains attached to both sides of the waist, hanging naturally over the trousers.\n- Small metallic clips and hanging accessories attached to the chains.\n- Black fingerless leather gloves with metallic studs and details.\n- Rolled-up or slightly visible white shirt cuffs beneath the black blazer sleeves.\nRecreate the exact recognizable color combination: black, white, royal blue, lavender-blue and gold.\nPHOTOREALISTIC COSPLAY QUALITY\nThe result must look like an actual person wearing an expensive, professionally tailored cosplay costume in a real-world photoshoot.\nReal human hair, realistic individual hair strands, natural fabric texture, detailed stitching, realistic leather gloves, authentic metallic accessories, natural shadows and professional fashion photography quality.\nThe result must NOT look like an anime drawing, cartoon, video game screenshot or CGI character.\nSTRICT ORIGINAL PHOTO PRESERVATION\nThis is an image EDITING task, NOT a new image generation task.\nPreserve the original photograph exactly:\n- Keep the person's original face and identity unchanged.\n- Do not modify facial features, eyes, nose, lips, jawline or skin.\n- Keep the original facial expression.\n- Keep the exact original body shape and proportions.\n- Keep the exact original pose and hand positions.\n- Keep the original camera angle and perspective.\n- Keep the exact original image dimensions and aspect ratio.\n- Keep the original crop and framing.\n- Keep the original background and every object in the environment.\n- Preserve the original lighting direction and photographic atmosphere.\nONLY change TWO things:\n1. The person's hairstyle.\n2. The person's clothing and accessories.\nDo not alter anything else.\nFINAL OUTPUT: The same person in the original photograph, with an extremely detailed, realistic silver-white Nakroth-inspired hairstyle featuring a center part and two long shoulder-length side locks, wearing the complete Nakroth Dimensional Guardian costume as a believable real-life cosplay.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "tintColor": "#3B82F6",
            "colors": ["#3B82F6", "#93C5FD"],
            "captureButtonColors": ["#3B82F6", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "⚔️"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_gojo_satoru",
            "id": "stk_gojo_satoru",
            "name": "Gojo Satoru cosplay",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the provided reference image while strictly preserving its original framing and crop.\n\n**CRITICAL: ORIGINAL HALF-BODY COMPOSITION MUST REMAIN UNCHANGED.**\n\n- The original image is a HALF-BODY PORTRAIT.\n- Keep exactly the same half-body framing as the reference image.\n- Preserve the original crop, showing the character from the head down to the same waist/torso area as the original.\n- Do NOT extend the image downward.\n- Do NOT generate legs, knees, feet or full-body content.\n- Do NOT zoom out or change the camera distance.\n- Do NOT change the image aspect ratio or canvas dimensions.\n- Keep the exact original camera angle, perspective and character position.\n\n**COSPLAY TRANSFORMATION ONLY:**\n\nReplace the original person's hairstyle and clothing with a realistic Satoru Gojo cosplay:\n- Spiky silver-white hair.\n- Black blindfold covering both eyes.\n- Black high-collar Gojo uniform jacket.\n- Realistic wearable cosplay materials and natural fabric folds.\n\n**PRESERVE EVERYTHING ELSE:**\n- Original person's body shape and proportions.\n- Original shoulder width and arm positions.\n- Original posture and head position.\n- Original background and lighting.\n- Original image composition and boundaries.\n\n**FINAL OUTPUT:**\nA photorealistic half-body Satoru Gojo cosplay portrait with exactly the same crop, framing, dimensions and camera perspective as the original reference image.\n\nThis is a localized character appearance and outfit replacement, NOT a full-body reconstruction or image expansion.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "tintColor": "#6366F1",
            "colors": ["#6366F1", "#A5B4FC"],
            "captureButtonColors": ["#6366F1", "#A5B4FC"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🤞"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_shopee_food",
            "id": "stk_shopee_food",
            "name": "Nhân Viên ShopeeFood 🛵",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the uploaded photograph. Transform the person into a realistic real-life ShopeeFood delivery employee wearing an authentic ShopeeFood rider uniform.\n\n**UNIFORM DETAILS:**\n- A vibrant orange ShopeeFood delivery jacket.\n- Signature bright orange color with white branding details.\n- ShopeeFood logo printed or embroidered clearly on the left chest.\n- Long-sleeved delivery jacket with a front zipper.\n- Matching orange delivery uniform shirt.\n- Dark navy or black trousers.\n- An orange ShopeeFood motorcycle helmet with recognizable white branding.\n- Optional orange ShopeeFood insulated delivery backpack with the official logo.\n\n**REALISTIC CLOTHING DETAILS:**\n- Natural fabric folds and realistic stitching.\n- Realistic zipper, collar, cuffs and jacket material.\n- Authentic motorcycle helmet with glossy reflections and chin strap.\n- The uniform must look genuinely worn by the person, not digitally pasted onto the body.\n- Accurate orange and white brand colors.\n\n**PRESERVE THE ORIGINAL PERSON:**\n- Keep the exact original face, identity, hairstyle and skin tone.\n- Preserve the original facial expression and body proportions.\n- Keep the original pose and hand gestures.\n- Only replace the clothing and add the ShopeeFood helmet and accessories.\n- Preserve the original background, camera angle and composition.\n\n**PHOTOGRAPHY STYLE:**\nUltra-photorealistic commercial photography, realistic human skin, natural lighting, professional DSLR quality, detailed fabric textures, authentic real-world appearance.\n\nNo cartoon, no anime, no sticker, no illustration, no white outline, no face replacement, no artificial CGI.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "tintColor": "#EE4D2D",
            "colors": ["#EE4D2D", "#FFA07A"],
            "captureButtonColors": ["#EE4D2D", "#FFA07A"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🛵"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "hom_nay_an_gi",
            "id": "hom_nay_an_gi",
            "name": "Hôm Nay Ăn Gì?",
            "category": "Trò Chơi Locket",
            "prompt": "hom_nay_an_gi",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "tintColor": "#FF8A3D",
            "colors": ["#FF9A3C", "#4FC3F7"],
            "captureButtonColors": ["#FF9A3C", "#4FC3F7"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "sfSymbol": "fork.knife",
                "symbol": "fork.knife",
                "emoji": "🍜"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_4cut",
            "id": "pb_cortis_4cut",
            "name": "Photobooth Cortis",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_shinchan_4cut",
            "id": "pb_shinchan_4cut",
            "name": "Photobooth Shin-chan 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_shinchan_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_supperman_4cut",
            "id": "pb_supperman_4cut",
            "name": "Photobooth Superman 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_supperman_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_meo_dang_yeu_4cut",
            "id": "pb_meo_dang_yeu_4cut",
            "name": "Photobooth Mèo Đáng Yêu",
            "category": "Photobooth 📸",
            "prompt": "pb_meo_dang_yeu_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "frame_ba_khi",
            "id": "frame_ba_khi",
            "name": "Khung Bá Khí",
            "category": "Khung Viền 🖼️",
            "prompt": "frame_ba_khi",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_v1",
            "id": "pb_cortis_v1",
            "name": "Photobooth Cortis V1",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_v1",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_v2",
            "id": "pb_cortis_v2",
            "name": "Photobooth Cortis V2",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_v2",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_denim_ripped_2x2",
            "id": "pb_denim_ripped_2x2",
            "name": "Photobooth Denim Ripped 2x2",
            "category": "Photobooth 📸",
            "prompt": "pb_denim_ripped_2x2",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_ech_xanh",
            "id": "pb_ech_xanh",
            "name": "Photobooth Ếch Xanh",
            "category": "Photobooth 📸",
            "prompt": "pb_ech_xanh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_galaxy",
            "id": "pb_galaxy",
            "name": "Photobooth Galaxy Y2K",
            "category": "Photobooth 📸",
            "prompt": "pb_galaxy",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_holo_4cut",
            "id": "pb_holo_4cut",
            "name": "Photobooth Hologram 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_holo_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_photobooth_hello_kitty",
            "id": "pb_photobooth_hello_kitty",
            "name": "Photobooth Hello Kitty Cute",
            "category": "Photobooth 📸",
            "prompt": "pb_photobooth_hello_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_ripped_paper_4cut",
            "id": "pb_ripped_paper_4cut",
            "name": "Photobooth Giấy Xé Ripped",
            "category": "Photobooth 📸",
            "prompt": "pb_ripped_paper_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_scrapbook_ripped_4cut",
            "id": "pb_scrapbook_ripped_4cut",
            "name": "Photobooth Scrapbook Vintage",
            "category": "Photobooth 📸",
            "prompt": "pb_scrapbook_ripped_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_denim_ripped",
            "id": "pb_single_denim_ripped",
            "name": "Photobooth Denim 1 Ô",
            "category": "Photobooth 📸",
            "prompt": "pb_single_denim_ripped",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_film_nostalgia",
            "id": "pb_single_film_nostalgia",
            "name": "Photobooth Film Nostalgia",
            "category": "Photobooth 📸",
            "prompt": "pb_single_film_nostalgia",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_y2k_silver_holo",
            "id": "pb_single_y2k_silver_holo",
            "name": "Photobooth Y2K Silver Holo",
            "category": "Photobooth 📸",
            "prompt": "pb_single_y2k_silver_holo",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_strawberry",
            "id": "pb_strawberry",
            "name": "Photobooth Dâu Tây Strawberry",
            "category": "Photobooth 📸",
            "prompt": "pb_strawberry",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_trung_bac_thao",
            "id": "pb_trung_bac_thao",
            "name": "Photobooth Trứng Bắc Thảo",
            "category": "Photobooth 📸",
            "prompt": "pb_trung_bac_thao",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_vien_hello_kitty",
            "id": "pb_vien_hello_kitty",
            "name": "Photobooth Viền Hello Kitty",
            "category": "Photobooth 📸",
            "prompt": "pb_vien_hello_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_vintage",
            "id": "pb_vintage",
            "name": "Photobooth Vintage Classic",
            "category": "Photobooth 📸",
            "prompt": "pb_vintage",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "photobooth_4cut",
            "id": "photobooth_4cut",
            "name": "Photobooth 4-Cut Classic",
            "category": "Photobooth 📸",
            "prompt": "photobooth_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "photobooth_cute",
            "id": "photobooth_cute",
            "name": "Photobooth Pastel Cute",
            "category": "Photobooth 📸",
            "prompt": "photobooth_cute",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_anh_o_kitty_v_sao",
            "id": "khung_anh_o_kitty_v_sao",
            "name": "Khung Ô Kitty & Ngôi Sao",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_anh_o_kitty_v_sao",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_doraemon_shinchan_kitty",
            "id": "khung_doraemon_shinchan_kitty",
            "name": "Khung Doraemon & Shinchan",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_doraemon_shinchan_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_hello_kitty_h_ng_pastel",
            "id": "khung_hello_kitty_h_ng_pastel",
            "name": "Khung Hello Kitty Hồng Pastel",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_hello_kitty_h_ng_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_hello_kitty_pastel_ng_t_ng_o",
            "id": "khung_hello_kitty_pastel_ng_t_ng_o",
            "name": "Khung Hello Kitty Ngọt Ngào",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_hello_kitty_pastel_ng_t_ng_o",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_kh_ng_gian_xanh_pastel",
            "id": "khung_kh_ng_gian_xanh_pastel",
            "name": "Khung Không Gian Xanh Pastel",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_kh_ng_gian_xanh_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "id": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "name": "Khung Nhành Hoa Pastel Viền Xanh",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_n_pastel_vi_n_ren",
            "id": "khung_nh_n_pastel_vi_n_ren",
            "name": "Khung Nhẫn Pastel Viền Ren",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_n_pastel_vi_n_ren",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "id": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "name": "Khung Pastel Sò Hải Cẩu",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_shin_chan_vi_n_m_nh",
            "id": "khung_nh_shin_chan_vi_n_m_nh",
            "name": "Khung Shinchan Viền Mảnh",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_shin_chan_vi_n_m_nh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "id": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "name": "Khung Vương Miện Bạc",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "id": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "name": "Khung Vương Miện Sao Hồng",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_xanh_v_tay_sao_v_ng",
            "id": "khung_xanh_v_tay_sao_v_ng",
            "name": "Khung Xanh Vẽ Tay Sao Vàng",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_xanh_v_tay_sao_v_ng",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }],
        "remoteFilters": [{
            "uid": "stk_tai_tho",
            "id": "stk_tai_tho",
            "name": "Bờm Tai Thỏ 🐰",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Keep the person's exact face, expression, pose, and background from the photo, and realistically place a cute fluffy white and soft pink plush bunny ears headband sitting naturally on top of their head with matching soft lighting and natural shadows. If there are multiple people, put a matching bunny ears headband on each person cleanly.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "tintColor": "#FFB6C1",
            "colors": ["#FFB6C1", "#FF69B4"],
            "captureButtonColors": ["#FFB6C1", "#FF69B4"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🐰"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_mu_ngu_khoc",
            "id": "stk_mu_ngu_khoc",
            "name": "Mũ Ngủ Khóc Nhè 😭",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Apply the exact cartoon face filter from the reference image to the person's face.\n\n**FILTER ELEMENTS:**\n1. A cream-colored pixel-art sleeping hat with thick black pixel outlines and a light cyan fluffy pom-pom on the left side.\n2. Large, thin, perfectly round black wire-frame glasses positioned over both eyes. Keep both circular lenses clearly visible and symmetrical.\n3. Two exaggerated glossy cyan-blue anime crying streams extending outward from the inner corners of both eyes, with small floating water droplets.\n4. A tiny black spiral doodle on the nose.\n5. Two small curved black whisker-like lines on each cheek.\n\n**FACE BEAUTIFICATION:**\n- Make the face slightly smaller and slimmer.\n- Gently reduce cheek width.\n- Create a naturally slim V-shaped jawline.\n- Keep the face proportions realistic and symmetrical.\n- Do not distort the eyes, nose, mouth, or facial identity.\n\n**IMPORTANT REQUIREMENTS:**\n- Precisely align the hat, glasses, tears, nose doodle, and cheek details with the person's facial features.\n- The glasses MUST be included and clearly visible.\n- Preserve the original person's identity, hairstyle, clothing, pose, and background.\n- Use a combination of cute 8-bit pixel art and glossy 3D cartoon effects.\n- High-quality, clean edges, realistic face tracking, polished selfie filter aesthetic.\n- Do not add extra accessories or text.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "tintColor": "#67E8F9",
            "colors": ["#67E8F9", "#FEF3C7"],
            "captureButtonColors": ["#67E8F9", "#FEF3C7"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "😭"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_jollibee",
            "id": "stk_jollibee",
            "name": "Nhân Viên Jollibee 🐝",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the uploaded photograph. Keep the exact same person from the original image.\n\nChange ONLY the person's clothing into a realistic Jollibee restaurant employee uniform, as if the person is genuinely wearing it in a real photograph.\n\n**JOLLIBEE UNIFORM:**\n- A bright red short-sleeved polo shirt.\n- Yellow panels running along both shoulders and sleeves.\n- Blue and yellow striped collar.\n- Authentic Jollibee bee mascot logo embroidered on the left chest.\n- A small employee name tag on the right chest.\n- Dark navy blue waist apron with the Jollibee logo and branding.\n- Matching dark navy trousers.\n\n**REALISTIC CLOTHING DETAILS:**\n- Make the uniform fit naturally on the person's actual body.\n- Realistic fabric texture, stitching, wrinkles and folds.\n- Natural interaction between the clothing and the person's arms, shoulders and body.\n- The shirt and apron must look physically worn, not digitally pasted onto the person.\n\n**PRESERVE THE ORIGINAL PHOTO:**\n- Keep the person's original face, identity, hairstyle, skin tone and facial expression exactly unchanged.\n- Keep the original body shape, pose, hands and proportions.\n- Keep the original background, lighting, camera angle and image composition.\n- Do not change the person's age or facial features.\n\n**FINAL RESULT:**\nUltra-photorealistic real-life photograph, indistinguishable from an actual photo of the same person wearing a Jollibee employee uniform at the time the original photo was taken.\n\nNo sticker, no cartoon, no illustration, no white outline, no cutout, no transparent background, no 3D rendering.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "tintColor": "#E31837",
            "colors": ["#E31837", "#FFC72C"],
            "captureButtonColors": ["#E31837", "#FFC72C"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🐝"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_nak_ve_than",
            "id": "stk_nak_ve_than",
            "name": "Nak Vệ Thần ⚔️",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Transform the person in the uploaded photograph into a photorealistic real-life cosplay version of Nakroth – Dimensional Guardian from Arena of Valor.\nIMPORTANT: Create the hairstyle and costume entirely from the written description below. Do not require or rely on any additional reference images.\nHAIRSTYLE – SIGNATURE SILVER-WHITE HAIR\nReplace the person's original hairstyle with an elaborate silver-white hairstyle inspired by Nakroth's iconic in-game appearance.\n- Bright metallic silver-white hair.\n- Extremely voluminous, spiky and layered hairstyle.\n- Multiple large, sharp, outward-swept hair spikes on the top and both sides of the head.\n- Distinctive middle-parted hairstyle, with hair naturally divided into two sections.\n- Long, flowing side locks on BOTH sides of the face, extending down to the shoulders.\n- Two clearly visible long sections framing the cheeks and neck.\n- Additional layered strands flowing behind both ears.\n- Slightly messy, dynamic, luxurious anime-inspired hairstyle recreated with realistic human hair.\n- Every strand must look natural, detailed and physically realistic.\n- Do not make the hair short, flat, straight or a simple long wig.\nCOSTUME – NAKROTH DIMENSIONAL GUARDIAN\nReplace the person's original outfit with the complete signature costume:\n- Cropped black fitted blazer with a structured fashion silhouette.\n- Thin, elegant white piping outlining the blazer's lapels, front edges and pockets.\n- White dress shirt underneath.\n- Deep royal-blue necktie.\n- A distinctive metallic GOLD FOUR-POINT STAR ORNAMENT positioned at the tie knot. It must have four clearly defined pointed ends, NOT a triangle.\n- Light lavender-blue tailored trousers.\n- Black belt with a metallic buckle.\n- Decorative silver chains attached to both sides of the waist, hanging naturally over the trousers.\n- Small metallic clips and hanging accessories attached to the chains.\n- Black fingerless leather gloves with metallic studs and details.\n- Rolled-up or slightly visible white shirt cuffs beneath the black blazer sleeves.\nRecreate the exact recognizable color combination: black, white, royal blue, lavender-blue and gold.\nPHOTOREALISTIC COSPLAY QUALITY\nThe result must look like an actual person wearing an expensive, professionally tailored cosplay costume in a real-world photoshoot.\nReal human hair, realistic individual hair strands, natural fabric texture, detailed stitching, realistic leather gloves, authentic metallic accessories, natural shadows and professional fashion photography quality.\nThe result must NOT look like an anime drawing, cartoon, video game screenshot or CGI character.\nSTRICT ORIGINAL PHOTO PRESERVATION\nThis is an image EDITING task, NOT a new image generation task.\nPreserve the original photograph exactly:\n- Keep the person's original face and identity unchanged.\n- Do not modify facial features, eyes, nose, lips, jawline or skin.\n- Keep the original facial expression.\n- Keep the exact original body shape and proportions.\n- Keep the exact original pose and hand positions.\n- Keep the original camera angle and perspective.\n- Keep the exact original image dimensions and aspect ratio.\n- Keep the original crop and framing.\n- Keep the original background and every object in the environment.\n- Preserve the original lighting direction and photographic atmosphere.\nONLY change TWO things:\n1. The person's hairstyle.\n2. The person's clothing and accessories.\nDo not alter anything else.\nFINAL OUTPUT: The same person in the original photograph, with an extremely detailed, realistic silver-white Nakroth-inspired hairstyle featuring a center part and two long shoulder-length side locks, wearing the complete Nakroth Dimensional Guardian costume as a believable real-life cosplay.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "tintColor": "#3B82F6",
            "colors": ["#3B82F6", "#93C5FD"],
            "captureButtonColors": ["#3B82F6", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "⚔️"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_gojo_satoru",
            "id": "stk_gojo_satoru",
            "name": "Gojo Satoru cosplay",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the provided reference image while strictly preserving its original framing and crop.\n\n**CRITICAL: ORIGINAL HALF-BODY COMPOSITION MUST REMAIN UNCHANGED.**\n\n- The original image is a HALF-BODY PORTRAIT.\n- Keep exactly the same half-body framing as the reference image.\n- Preserve the original crop, showing the character from the head down to the same waist/torso area as the original.\n- Do NOT extend the image downward.\n- Do NOT generate legs, knees, feet or full-body content.\n- Do NOT zoom out or change the camera distance.\n- Do NOT change the image aspect ratio or canvas dimensions.\n- Keep the exact original camera angle, perspective and character position.\n\n**COSPLAY TRANSFORMATION ONLY:**\n\nReplace the original person's hairstyle and clothing with a realistic Satoru Gojo cosplay:\n- Spiky silver-white hair.\n- Black blindfold covering both eyes.\n- Black high-collar Gojo uniform jacket.\n- Realistic wearable cosplay materials and natural fabric folds.\n\n**PRESERVE EVERYTHING ELSE:**\n- Original person's body shape and proportions.\n- Original shoulder width and arm positions.\n- Original posture and head position.\n- Original background and lighting.\n- Original image composition and boundaries.\n\n**FINAL OUTPUT:**\nA photorealistic half-body Satoru Gojo cosplay portrait with exactly the same crop, framing, dimensions and camera perspective as the original reference image.\n\nThis is a localized character appearance and outfit replacement, NOT a full-body reconstruction or image expansion.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "tintColor": "#6366F1",
            "colors": ["#6366F1", "#A5B4FC"],
            "captureButtonColors": ["#6366F1", "#A5B4FC"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🤞"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_shopee_food",
            "id": "stk_shopee_food",
            "name": "Nhân Viên ShopeeFood 🛵",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the uploaded photograph. Transform the person into a realistic real-life ShopeeFood delivery employee wearing an authentic ShopeeFood rider uniform.\n\n**UNIFORM DETAILS:**\n- A vibrant orange ShopeeFood delivery jacket.\n- Signature bright orange color with white branding details.\n- ShopeeFood logo printed or embroidered clearly on the left chest.\n- Long-sleeved delivery jacket with a front zipper.\n- Matching orange delivery uniform shirt.\n- Dark navy or black trousers.\n- An orange ShopeeFood motorcycle helmet with recognizable white branding.\n- Optional orange ShopeeFood insulated delivery backpack with the official logo.\n\n**REALISTIC CLOTHING DETAILS:**\n- Natural fabric folds and realistic stitching.\n- Realistic zipper, collar, cuffs and jacket material.\n- Authentic motorcycle helmet with glossy reflections and chin strap.\n- The uniform must look genuinely worn by the person, not digitally pasted onto the body.\n- Accurate orange and white brand colors.\n\n**PRESERVE THE ORIGINAL PERSON:**\n- Keep the exact original face, identity, hairstyle and skin tone.\n- Preserve the original facial expression and body proportions.\n- Keep the original pose and hand gestures.\n- Only replace the clothing and add the ShopeeFood helmet and accessories.\n- Preserve the original background, camera angle and composition.\n\n**PHOTOGRAPHY STYLE:**\nUltra-photorealistic commercial photography, realistic human skin, natural lighting, professional DSLR quality, detailed fabric textures, authentic real-world appearance.\n\nNo cartoon, no anime, no sticker, no illustration, no white outline, no face replacement, no artificial CGI.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "tintColor": "#EE4D2D",
            "colors": ["#EE4D2D", "#FFA07A"],
            "captureButtonColors": ["#EE4D2D", "#FFA07A"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🛵"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "hom_nay_an_gi",
            "id": "hom_nay_an_gi",
            "name": "Hôm Nay Ăn Gì?",
            "category": "Trò Chơi Locket",
            "prompt": "hom_nay_an_gi",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "tintColor": "#FF8A3D",
            "colors": ["#FF9A3C", "#4FC3F7"],
            "captureButtonColors": ["#FF9A3C", "#4FC3F7"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "sfSymbol": "fork.knife",
                "symbol": "fork.knife",
                "emoji": "🍜"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_4cut",
            "id": "pb_cortis_4cut",
            "name": "Photobooth Cortis",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_shinchan_4cut",
            "id": "pb_shinchan_4cut",
            "name": "Photobooth Shin-chan 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_shinchan_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_supperman_4cut",
            "id": "pb_supperman_4cut",
            "name": "Photobooth Superman 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_supperman_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_meo_dang_yeu_4cut",
            "id": "pb_meo_dang_yeu_4cut",
            "name": "Photobooth Mèo Đáng Yêu",
            "category": "Photobooth 📸",
            "prompt": "pb_meo_dang_yeu_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "frame_ba_khi",
            "id": "frame_ba_khi",
            "name": "Khung Bá Khí",
            "category": "Khung Viền 🖼️",
            "prompt": "frame_ba_khi",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_v1",
            "id": "pb_cortis_v1",
            "name": "Photobooth Cortis V1",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_v1",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_v2",
            "id": "pb_cortis_v2",
            "name": "Photobooth Cortis V2",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_v2",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_denim_ripped_2x2",
            "id": "pb_denim_ripped_2x2",
            "name": "Photobooth Denim Ripped 2x2",
            "category": "Photobooth 📸",
            "prompt": "pb_denim_ripped_2x2",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_ech_xanh",
            "id": "pb_ech_xanh",
            "name": "Photobooth Ếch Xanh",
            "category": "Photobooth 📸",
            "prompt": "pb_ech_xanh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_galaxy",
            "id": "pb_galaxy",
            "name": "Photobooth Galaxy Y2K",
            "category": "Photobooth 📸",
            "prompt": "pb_galaxy",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_holo_4cut",
            "id": "pb_holo_4cut",
            "name": "Photobooth Hologram 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_holo_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_photobooth_hello_kitty",
            "id": "pb_photobooth_hello_kitty",
            "name": "Photobooth Hello Kitty Cute",
            "category": "Photobooth 📸",
            "prompt": "pb_photobooth_hello_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_ripped_paper_4cut",
            "id": "pb_ripped_paper_4cut",
            "name": "Photobooth Giấy Xé Ripped",
            "category": "Photobooth 📸",
            "prompt": "pb_ripped_paper_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_scrapbook_ripped_4cut",
            "id": "pb_scrapbook_ripped_4cut",
            "name": "Photobooth Scrapbook Vintage",
            "category": "Photobooth 📸",
            "prompt": "pb_scrapbook_ripped_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_denim_ripped",
            "id": "pb_single_denim_ripped",
            "name": "Photobooth Denim 1 Ô",
            "category": "Photobooth 📸",
            "prompt": "pb_single_denim_ripped",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_film_nostalgia",
            "id": "pb_single_film_nostalgia",
            "name": "Photobooth Film Nostalgia",
            "category": "Photobooth 📸",
            "prompt": "pb_single_film_nostalgia",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_y2k_silver_holo",
            "id": "pb_single_y2k_silver_holo",
            "name": "Photobooth Y2K Silver Holo",
            "category": "Photobooth 📸",
            "prompt": "pb_single_y2k_silver_holo",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_strawberry",
            "id": "pb_strawberry",
            "name": "Photobooth Dâu Tây Strawberry",
            "category": "Photobooth 📸",
            "prompt": "pb_strawberry",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_trung_bac_thao",
            "id": "pb_trung_bac_thao",
            "name": "Photobooth Trứng Bắc Thảo",
            "category": "Photobooth 📸",
            "prompt": "pb_trung_bac_thao",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_vien_hello_kitty",
            "id": "pb_vien_hello_kitty",
            "name": "Photobooth Viền Hello Kitty",
            "category": "Photobooth 📸",
            "prompt": "pb_vien_hello_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_vintage",
            "id": "pb_vintage",
            "name": "Photobooth Vintage Classic",
            "category": "Photobooth 📸",
            "prompt": "pb_vintage",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "photobooth_4cut",
            "id": "photobooth_4cut",
            "name": "Photobooth 4-Cut Classic",
            "category": "Photobooth 📸",
            "prompt": "photobooth_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "photobooth_cute",
            "id": "photobooth_cute",
            "name": "Photobooth Pastel Cute",
            "category": "Photobooth 📸",
            "prompt": "photobooth_cute",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_anh_o_kitty_v_sao",
            "id": "khung_anh_o_kitty_v_sao",
            "name": "Khung Ô Kitty & Ngôi Sao",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_anh_o_kitty_v_sao",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_doraemon_shinchan_kitty",
            "id": "khung_doraemon_shinchan_kitty",
            "name": "Khung Doraemon & Shinchan",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_doraemon_shinchan_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_hello_kitty_h_ng_pastel",
            "id": "khung_hello_kitty_h_ng_pastel",
            "name": "Khung Hello Kitty Hồng Pastel",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_hello_kitty_h_ng_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_hello_kitty_pastel_ng_t_ng_o",
            "id": "khung_hello_kitty_pastel_ng_t_ng_o",
            "name": "Khung Hello Kitty Ngọt Ngào",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_hello_kitty_pastel_ng_t_ng_o",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_kh_ng_gian_xanh_pastel",
            "id": "khung_kh_ng_gian_xanh_pastel",
            "name": "Khung Không Gian Xanh Pastel",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_kh_ng_gian_xanh_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "id": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "name": "Khung Nhành Hoa Pastel Viền Xanh",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_n_pastel_vi_n_ren",
            "id": "khung_nh_n_pastel_vi_n_ren",
            "name": "Khung Nhẫn Pastel Viền Ren",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_n_pastel_vi_n_ren",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "id": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "name": "Khung Pastel Sò Hải Cẩu",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_shin_chan_vi_n_m_nh",
            "id": "khung_nh_shin_chan_vi_n_m_nh",
            "name": "Khung Shinchan Viền Mảnh",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_shin_chan_vi_n_m_nh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "id": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "name": "Khung Vương Miện Bạc",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "id": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "name": "Khung Vương Miện Sao Hồng",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_xanh_v_tay_sao_v_ng",
            "id": "khung_xanh_v_tay_sao_v_ng",
            "name": "Khung Xanh Vẽ Tay Sao Vàng",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_xanh_v_tay_sao_v_ng",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }],
        "filters": [{
            "uid": "stk_tai_tho",
            "id": "stk_tai_tho",
            "name": "Bờm Tai Thỏ 🐰",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Keep the person's exact face, expression, pose, and background from the photo, and realistically place a cute fluffy white and soft pink plush bunny ears headband sitting naturally on top of their head with matching soft lighting and natural shadows. If there are multiple people, put a matching bunny ears headband on each person cleanly.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
            "tintColor": "#FFB6C1",
            "colors": ["#FFB6C1", "#FF69B4"],
            "captureButtonColors": ["#FFB6C1", "#FF69B4"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_tai_tho.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🐰"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_mu_ngu_khoc",
            "id": "stk_mu_ngu_khoc",
            "name": "Mũ Ngủ Khóc Nhè 😭",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Apply the exact cartoon face filter from the reference image to the person's face.\n\n**FILTER ELEMENTS:**\n1. A cream-colored pixel-art sleeping hat with thick black pixel outlines and a light cyan fluffy pom-pom on the left side.\n2. Large, thin, perfectly round black wire-frame glasses positioned over both eyes. Keep both circular lenses clearly visible and symmetrical.\n3. Two exaggerated glossy cyan-blue anime crying streams extending outward from the inner corners of both eyes, with small floating water droplets.\n4. A tiny black spiral doodle on the nose.\n5. Two small curved black whisker-like lines on each cheek.\n\n**FACE BEAUTIFICATION:**\n- Make the face slightly smaller and slimmer.\n- Gently reduce cheek width.\n- Create a naturally slim V-shaped jawline.\n- Keep the face proportions realistic and symmetrical.\n- Do not distort the eyes, nose, mouth, or facial identity.\n\n**IMPORTANT REQUIREMENTS:**\n- Precisely align the hat, glasses, tears, nose doodle, and cheek details with the person's facial features.\n- The glasses MUST be included and clearly visible.\n- Preserve the original person's identity, hairstyle, clothing, pose, and background.\n- Use a combination of cute 8-bit pixel art and glossy 3D cartoon effects.\n- High-quality, clean edges, realistic face tracking, polished selfie filter aesthetic.\n- Do not add extra accessories or text.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
            "tintColor": "#67E8F9",
            "colors": ["#67E8F9", "#FEF3C7"],
            "captureButtonColors": ["#67E8F9", "#FEF3C7"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_mu_ngu_khoc.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "😭"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_jollibee",
            "id": "stk_jollibee",
            "name": "Nhân Viên Jollibee 🐝",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the uploaded photograph. Keep the exact same person from the original image.\n\nChange ONLY the person's clothing into a realistic Jollibee restaurant employee uniform, as if the person is genuinely wearing it in a real photograph.\n\n**JOLLIBEE UNIFORM:**\n- A bright red short-sleeved polo shirt.\n- Yellow panels running along both shoulders and sleeves.\n- Blue and yellow striped collar.\n- Authentic Jollibee bee mascot logo embroidered on the left chest.\n- A small employee name tag on the right chest.\n- Dark navy blue waist apron with the Jollibee logo and branding.\n- Matching dark navy trousers.\n\n**REALISTIC CLOTHING DETAILS:**\n- Make the uniform fit naturally on the person's actual body.\n- Realistic fabric texture, stitching, wrinkles and folds.\n- Natural interaction between the clothing and the person's arms, shoulders and body.\n- The shirt and apron must look physically worn, not digitally pasted onto the person.\n\n**PRESERVE THE ORIGINAL PHOTO:**\n- Keep the person's original face, identity, hairstyle, skin tone and facial expression exactly unchanged.\n- Keep the original body shape, pose, hands and proportions.\n- Keep the original background, lighting, camera angle and image composition.\n- Do not change the person's age or facial features.\n\n**FINAL RESULT:**\nUltra-photorealistic real-life photograph, indistinguishable from an actual photo of the same person wearing a Jollibee employee uniform at the time the original photo was taken.\n\nNo sticker, no cartoon, no illustration, no white outline, no cutout, no transparent background, no 3D rendering.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
            "tintColor": "#E31837",
            "colors": ["#E31837", "#FFC72C"],
            "captureButtonColors": ["#E31837", "#FFC72C"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_jollibee.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🐝"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_nak_ve_than",
            "id": "stk_nak_ve_than",
            "name": "Nak Vệ Thần ⚔️",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Transform the person in the uploaded photograph into a photorealistic real-life cosplay version of Nakroth – Dimensional Guardian from Arena of Valor.\nIMPORTANT: Create the hairstyle and costume entirely from the written description below. Do not require or rely on any additional reference images.\nHAIRSTYLE – SIGNATURE SILVER-WHITE HAIR\nReplace the person's original hairstyle with an elaborate silver-white hairstyle inspired by Nakroth's iconic in-game appearance.\n- Bright metallic silver-white hair.\n- Extremely voluminous, spiky and layered hairstyle.\n- Multiple large, sharp, outward-swept hair spikes on the top and both sides of the head.\n- Distinctive middle-parted hairstyle, with hair naturally divided into two sections.\n- Long, flowing side locks on BOTH sides of the face, extending down to the shoulders.\n- Two clearly visible long sections framing the cheeks and neck.\n- Additional layered strands flowing behind both ears.\n- Slightly messy, dynamic, luxurious anime-inspired hairstyle recreated with realistic human hair.\n- Every strand must look natural, detailed and physically realistic.\n- Do not make the hair short, flat, straight or a simple long wig.\nCOSTUME – NAKROTH DIMENSIONAL GUARDIAN\nReplace the person's original outfit with the complete signature costume:\n- Cropped black fitted blazer with a structured fashion silhouette.\n- Thin, elegant white piping outlining the blazer's lapels, front edges and pockets.\n- White dress shirt underneath.\n- Deep royal-blue necktie.\n- A distinctive metallic GOLD FOUR-POINT STAR ORNAMENT positioned at the tie knot. It must have four clearly defined pointed ends, NOT a triangle.\n- Light lavender-blue tailored trousers.\n- Black belt with a metallic buckle.\n- Decorative silver chains attached to both sides of the waist, hanging naturally over the trousers.\n- Small metallic clips and hanging accessories attached to the chains.\n- Black fingerless leather gloves with metallic studs and details.\n- Rolled-up or slightly visible white shirt cuffs beneath the black blazer sleeves.\nRecreate the exact recognizable color combination: black, white, royal blue, lavender-blue and gold.\nPHOTOREALISTIC COSPLAY QUALITY\nThe result must look like an actual person wearing an expensive, professionally tailored cosplay costume in a real-world photoshoot.\nReal human hair, realistic individual hair strands, natural fabric texture, detailed stitching, realistic leather gloves, authentic metallic accessories, natural shadows and professional fashion photography quality.\nThe result must NOT look like an anime drawing, cartoon, video game screenshot or CGI character.\nSTRICT ORIGINAL PHOTO PRESERVATION\nThis is an image EDITING task, NOT a new image generation task.\nPreserve the original photograph exactly:\n- Keep the person's original face and identity unchanged.\n- Do not modify facial features, eyes, nose, lips, jawline or skin.\n- Keep the original facial expression.\n- Keep the exact original body shape and proportions.\n- Keep the exact original pose and hand positions.\n- Keep the original camera angle and perspective.\n- Keep the exact original image dimensions and aspect ratio.\n- Keep the original crop and framing.\n- Keep the original background and every object in the environment.\n- Preserve the original lighting direction and photographic atmosphere.\nONLY change TWO things:\n1. The person's hairstyle.\n2. The person's clothing and accessories.\nDo not alter anything else.\nFINAL OUTPUT: The same person in the original photograph, with an extremely detailed, realistic silver-white Nakroth-inspired hairstyle featuring a center part and two long shoulder-length side locks, wearing the complete Nakroth Dimensional Guardian costume as a believable real-life cosplay.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
            "tintColor": "#3B82F6",
            "colors": ["#3B82F6", "#93C5FD"],
            "captureButtonColors": ["#3B82F6", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_nak_ve_than.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "⚔️"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_gojo_satoru",
            "id": "stk_gojo_satoru",
            "name": "Gojo Satoru cosplay",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the provided reference image while strictly preserving its original framing and crop.\n\n**CRITICAL: ORIGINAL HALF-BODY COMPOSITION MUST REMAIN UNCHANGED.**\n\n- The original image is a HALF-BODY PORTRAIT.\n- Keep exactly the same half-body framing as the reference image.\n- Preserve the original crop, showing the character from the head down to the same waist/torso area as the original.\n- Do NOT extend the image downward.\n- Do NOT generate legs, knees, feet or full-body content.\n- Do NOT zoom out or change the camera distance.\n- Do NOT change the image aspect ratio or canvas dimensions.\n- Keep the exact original camera angle, perspective and character position.\n\n**COSPLAY TRANSFORMATION ONLY:**\n\nReplace the original person's hairstyle and clothing with a realistic Satoru Gojo cosplay:\n- Spiky silver-white hair.\n- Black blindfold covering both eyes.\n- Black high-collar Gojo uniform jacket.\n- Realistic wearable cosplay materials and natural fabric folds.\n\n**PRESERVE EVERYTHING ELSE:**\n- Original person's body shape and proportions.\n- Original shoulder width and arm positions.\n- Original posture and head position.\n- Original background and lighting.\n- Original image composition and boundaries.\n\n**FINAL OUTPUT:**\nA photorealistic half-body Satoru Gojo cosplay portrait with exactly the same crop, framing, dimensions and camera perspective as the original reference image.\n\nThis is a localized character appearance and outfit replacement, NOT a full-body reconstruction or image expansion.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
            "tintColor": "#6366F1",
            "colors": ["#6366F1", "#A5B4FC"],
            "captureButtonColors": ["#6366F1", "#A5B4FC"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_gojo_satoru.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🤞"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "stk_shopee_food",
            "id": "stk_shopee_food",
            "name": "Nhân Viên ShopeeFood 🛵",
            "category": "Hiệu Ứng AI 3D Hot 🔥",
            "prompt": "Edit the uploaded photograph. Transform the person into a realistic real-life ShopeeFood delivery employee wearing an authentic ShopeeFood rider uniform.\n\n**UNIFORM DETAILS:**\n- A vibrant orange ShopeeFood delivery jacket.\n- Signature bright orange color with white branding details.\n- ShopeeFood logo printed or embroidered clearly on the left chest.\n- Long-sleeved delivery jacket with a front zipper.\n- Matching orange delivery uniform shirt.\n- Dark navy or black trousers.\n- An orange ShopeeFood motorcycle helmet with recognizable white branding.\n- Optional orange ShopeeFood insulated delivery backpack with the official logo.\n\n**REALISTIC CLOTHING DETAILS:**\n- Natural fabric folds and realistic stitching.\n- Realistic zipper, collar, cuffs and jacket material.\n- Authentic motorcycle helmet with glossy reflections and chin strap.\n- The uniform must look genuinely worn by the person, not digitally pasted onto the body.\n- Accurate orange and white brand colors.\n\n**PRESERVE THE ORIGINAL PERSON:**\n- Keep the exact original face, identity, hairstyle and skin tone.\n- Preserve the original facial expression and body proportions.\n- Keep the original pose and hand gestures.\n- Only replace the clothing and add the ShopeeFood helmet and accessories.\n- Preserve the original background, camera angle and composition.\n\n**PHOTOGRAPHY STYLE:**\nUltra-photorealistic commercial photography, realistic human skin, natural lighting, professional DSLR quality, detailed fabric textures, authentic real-world appearance.\n\nNo cartoon, no anime, no sticker, no illustration, no white outline, no face replacement, no artificial CGI.",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
            "tintColor": "#EE4D2D",
            "colors": ["#EE4D2D", "#FFA07A"],
            "captureButtonColors": ["#EE4D2D", "#FFA07A"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/ai/stk_shopee_food.png",
                "sfSymbol": "sparkles",
                "symbol": "sparkles",
                "emoji": "🛵"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "hom_nay_an_gi",
            "id": "hom_nay_an_gi",
            "name": "Hôm Nay Ăn Gì?",
            "category": "Trò Chơi Locket",
            "prompt": "hom_nay_an_gi",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
            "tintColor": "#FF8A3D",
            "colors": ["#FF9A3C", "#4FC3F7"],
            "captureButtonColors": ["#FF9A3C", "#4FC3F7"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/hom_nay_an_gi.png",
                "sfSymbol": "fork.knife",
                "symbol": "fork.knife",
                "emoji": "🍜"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_4cut",
            "id": "pb_cortis_4cut",
            "name": "Photobooth Cortis",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_shinchan_4cut",
            "id": "pb_shinchan_4cut",
            "name": "Photobooth Shin-chan 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_shinchan_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_shinchan_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_supperman_4cut",
            "id": "pb_supperman_4cut",
            "name": "Photobooth Superman 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_supperman_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_supperman_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_meo_dang_yeu_4cut",
            "id": "pb_meo_dang_yeu_4cut",
            "name": "Photobooth Mèo Đáng Yêu",
            "category": "Photobooth 📸",
            "prompt": "pb_meo_dang_yeu_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_meo_dang_yeu_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "frame_ba_khi",
            "id": "frame_ba_khi",
            "name": "Khung Bá Khí",
            "category": "Khung Viền 🖼️",
            "prompt": "frame_ba_khi",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/frame_ba_khi.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_v1",
            "id": "pb_cortis_v1",
            "name": "Photobooth Cortis V1",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_v1",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v1.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_cortis_v2",
            "id": "pb_cortis_v2",
            "name": "Photobooth Cortis V2",
            "category": "Photobooth 📸",
            "prompt": "pb_cortis_v2",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_cortis_v2.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_denim_ripped_2x2",
            "id": "pb_denim_ripped_2x2",
            "name": "Photobooth Denim Ripped 2x2",
            "category": "Photobooth 📸",
            "prompt": "pb_denim_ripped_2x2",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_denim_ripped_2x2.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_ech_xanh",
            "id": "pb_ech_xanh",
            "name": "Photobooth Ếch Xanh",
            "category": "Photobooth 📸",
            "prompt": "pb_ech_xanh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_ech_xanh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_galaxy",
            "id": "pb_galaxy",
            "name": "Photobooth Galaxy Y2K",
            "category": "Photobooth 📸",
            "prompt": "pb_galaxy",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_galaxy.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_holo_4cut",
            "id": "pb_holo_4cut",
            "name": "Photobooth Hologram 4-Cut",
            "category": "Photobooth 📸",
            "prompt": "pb_holo_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_holo_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_photobooth_hello_kitty",
            "id": "pb_photobooth_hello_kitty",
            "name": "Photobooth Hello Kitty Cute",
            "category": "Photobooth 📸",
            "prompt": "pb_photobooth_hello_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_photobooth_hello_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_ripped_paper_4cut",
            "id": "pb_ripped_paper_4cut",
            "name": "Photobooth Giấy Xé Ripped",
            "category": "Photobooth 📸",
            "prompt": "pb_ripped_paper_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_ripped_paper_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_scrapbook_ripped_4cut",
            "id": "pb_scrapbook_ripped_4cut",
            "name": "Photobooth Scrapbook Vintage",
            "category": "Photobooth 📸",
            "prompt": "pb_scrapbook_ripped_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_scrapbook_ripped_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_denim_ripped",
            "id": "pb_single_denim_ripped",
            "name": "Photobooth Denim 1 Ô",
            "category": "Photobooth 📸",
            "prompt": "pb_single_denim_ripped",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_denim_ripped.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_film_nostalgia",
            "id": "pb_single_film_nostalgia",
            "name": "Photobooth Film Nostalgia",
            "category": "Photobooth 📸",
            "prompt": "pb_single_film_nostalgia",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_film_nostalgia.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_single_y2k_silver_holo",
            "id": "pb_single_y2k_silver_holo",
            "name": "Photobooth Y2K Silver Holo",
            "category": "Photobooth 📸",
            "prompt": "pb_single_y2k_silver_holo",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_single_y2k_silver_holo.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_strawberry",
            "id": "pb_strawberry",
            "name": "Photobooth Dâu Tây Strawberry",
            "category": "Photobooth 📸",
            "prompt": "pb_strawberry",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_strawberry.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_trung_bac_thao",
            "id": "pb_trung_bac_thao",
            "name": "Photobooth Trứng Bắc Thảo",
            "category": "Photobooth 📸",
            "prompt": "pb_trung_bac_thao",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_trung_bac_thao.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_vien_hello_kitty",
            "id": "pb_vien_hello_kitty",
            "name": "Photobooth Viền Hello Kitty",
            "category": "Photobooth 📸",
            "prompt": "pb_vien_hello_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_vien_hello_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "pb_vintage",
            "id": "pb_vintage",
            "name": "Photobooth Vintage Classic",
            "category": "Photobooth 📸",
            "prompt": "pb_vintage",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/pb_vintage.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "photobooth_4cut",
            "id": "photobooth_4cut",
            "name": "Photobooth 4-Cut Classic",
            "category": "Photobooth 📸",
            "prompt": "photobooth_4cut",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/photobooth_4cut.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "photobooth_cute",
            "id": "photobooth_cute",
            "name": "Photobooth Pastel Cute",
            "category": "Photobooth 📸",
            "prompt": "photobooth_cute",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/photobooth_cute.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_anh_o_kitty_v_sao",
            "id": "khung_anh_o_kitty_v_sao",
            "name": "Khung Ô Kitty & Ngôi Sao",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_anh_o_kitty_v_sao",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_anh_o_kitty_v_sao.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_doraemon_shinchan_kitty",
            "id": "khung_doraemon_shinchan_kitty",
            "name": "Khung Doraemon & Shinchan",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_doraemon_shinchan_kitty",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_doraemon_shinchan_kitty.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_hello_kitty_h_ng_pastel",
            "id": "khung_hello_kitty_h_ng_pastel",
            "name": "Khung Hello Kitty Hồng Pastel",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_hello_kitty_h_ng_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_h_ng_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_hello_kitty_pastel_ng_t_ng_o",
            "id": "khung_hello_kitty_pastel_ng_t_ng_o",
            "name": "Khung Hello Kitty Ngọt Ngào",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_hello_kitty_pastel_ng_t_ng_o",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_hello_kitty_pastel_ng_t_ng_o.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_kh_ng_gian_xanh_pastel",
            "id": "khung_kh_ng_gian_xanh_pastel",
            "name": "Khung Không Gian Xanh Pastel",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_kh_ng_gian_xanh_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_kh_ng_gian_xanh_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "id": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "name": "Khung Nhành Hoa Pastel Viền Xanh",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_hoa_pastel_vi_n_xanh_m_nh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_hoa_pastel_vi_n_xanh_m_nh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_n_pastel_vi_n_ren",
            "id": "khung_nh_n_pastel_vi_n_ren",
            "name": "Khung Nhẫn Pastel Viền Ren",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_n_pastel_vi_n_ren",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_n_pastel_vi_n_ren.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "id": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "name": "Khung Pastel Sò Hải Cẩu",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_pastel_vi_n_s_h_i_c_u",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_pastel_vi_n_s_h_i_c_u.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_shin_chan_vi_n_m_nh",
            "id": "khung_nh_shin_chan_vi_n_m_nh",
            "name": "Khung Shinchan Viền Mảnh",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_shin_chan_vi_n_m_nh",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_shin_chan_vi_n_m_nh.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "id": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "name": "Khung Vương Miện Bạc",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_nh_vu_ng_m_ng_nh_n_b_c",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_nh_vu_ng_m_ng_nh_n_b_c.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "id": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "name": "Khung Vương Miện Sao Hồng",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_vu_ng_ng_i_sao_h_ng_pastel",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_vu_ng_ng_i_sao_h_ng_pastel.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }, {
            "uid": "khung_xanh_v_tay_sao_v_ng",
            "id": "khung_xanh_v_tay_sao_v_ng",
            "name": "Khung Xanh Vẽ Tay Sao Vàng",
            "category": "Khung Viền 🖼️",
            "prompt": "khung_xanh_v_tay_sao_v_ng",
            "style": "cutout",
            "type": "normal",
            "filterType": "normal",
            "overlay": true,
            "imageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "overlayImageUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "overlayImageURL": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
            "tintColor": "#1D4ED8",
            "colors": ["#1D4ED8", "#93C5FD"],
            "captureButtonColors": ["#1D4ED8", "#93C5FD"],
            "icon": {
                "url": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "iconUrl": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "remoteImage": "https://filter.phong200614.workers.dev/assets/frames/khung_xanh_v_tay_sao_v_ng.png",
                "sfSymbol": "square.grid.2x2",
                "symbol": "square.grid.2x2",
                "emoji": "📸"
            },
            "outputUrl": null,
            "productUrl": null,
            "textColor": "#FFFFFF",
            "referenceImages": [],
            "requires_gold": false,
            "requiresGold": false,
            "is_gold": false,
            "isGold": false,
            "unlocked": true,
            "is_unlocked": true,
            "isUnlocked": true,
            "free": true,
            "allowsTryFilter": true,
            "allows_try_filter": true,
            "tryButtonEnabled": true,
            "try_button_enabled": true
        }]
    };

    const CUSTOM_OVERLAY_ITEMS = [{
        "section": "General",
        "items": [{
            "overlay_id": "caption:standard",
            "source": "local",
            "caption": {
                "type": "standard"
            },
            "sort_order": 0
        }, {
            "overlay_id": "caption:color_palette",
            "source": "local",
            "caption": {
                "type": "color_palette"
            },
            "sort_order": 1
        }, {
            "overlay_id": "caption:review",
            "source": "local",
            "caption": {
                "type": "review"
            },
            "sort_order": 2
        }, {
            "overlay_id": "caption:music",
            "source": "local",
            "caption": {
                "type": "music"
            },
            "sort_order": 3
        }, {
            "overlay_id": "caption:location",
            "source": "local",
            "caption": {
                "type": "location"
            },
            "sort_order": 4
        }, {
            "overlay_id": "caption:weather",
            "source": "local",
            "caption": {
                "type": "weather"
            },
            "sort_order": 5
        }, {
            "overlay_id": "caption:time",
            "source": "local",
            "caption": {
                "type": "time"
            },
            "sort_order": 6
        }, {
            "overlay_id": "caption:streak",
            "source": "local",
            "caption": {
                "type": "streak"
            },
            "sort_order": 7
        }, {
            "overlay_id": "caption:star_sign",
            "source": "local",
            "caption": {
                "type": "star_sign"
            },
            "sort_order": 8
        }, {
            "overlay_id": "caption:poll",
            "source": "local",
            "caption": {
                "type": "poll"
            }
        }]
    }, {
        section: "🎨 General",
                items: [
                    { overlay_id: "caption:standard", source: "local", caption: { type: "standard" } },
                    { overlay_id: "caption:review", source: "local", caption: { type: "review" } },
                    { overlay_id: "caption:music", source: "local", caption: { type: "music" } },
                    { overlay_id: "caption:location", source: "local", caption: { type: "location" } },
                    { overlay_id: "caption:weather", source: "local", caption: { type: "weather" } },
                    { overlay_id: "caption:time", source: "local", caption: { type: "time" } },
                    { overlay_id: "caption:streak", source: "local", caption: { type: "streak" } },
                    { overlay_id: "caption:star_sign", source: "local", caption: { type: "star_sign" } },
                    { overlay_id: "caption:poll", source: "local", caption: { type: "poll" } },
                    { overlay_id: "caption:color_palette", source: "local", caption: { type: "color_palette" } },
                    { overlay_id: "caption:locket_count", source: "local", caption: { type: "locket_count" } }
                ]
            },
            {
                section: "🎨 Holiday Caption",
                items: [
                    {
                        overlay_id: "caption:halloween_2026",
                        source: "remote",
                        caption: {
                            background: { colors: ["#150804", "#C8540D"] },
                            icon: { data: "🎃", type: "emoji" },
                            max_lines: 1,
                            text: "Halloween",
                            localized_text: { en: "Halloween", vn: "Halloween" },
                            text_color: "#FFB182",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:autumn_2026",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFE0A0", "#F6A53A"] },
                            icon: { data: "🍂", type: "emoji" },
                            max_lines: 1,
                            text: "Xin chào Mùa Thu",
                            localized_text: { en: "Xin chào Mùa Thu", vn: "Xin chào Mùa Thu" },
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:christmas_eve_2026",
                        source: "remote",
                        caption: {
                            background: { colors: ["#2FA85F", "#176B3A"] },
                            icon: { data: "🕯️", type: "emoji" },
                            max_lines: 1,
                            text: "Giáng sinh an lành",
                            localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" },
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:christmas_day_2026",
                        source: "remote",
                        caption: {
                            background: { colors: ["#E53935", "#A81818"] },
                            icon: { data: "🎄", type: "emoji" },
                            max_lines: 1,
                            text: "Giáng sinh an lành",
                            localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" },
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:new_years_eve_2026",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFC64B", "#FFEDBF"] },
                            icon: { data: "🥂", type: "emoji" },
                            max_lines: 1,
                            text: "Xin chào 2027!",
                            localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" },
                            text_color: "#643F00",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:new_years_day_2027",
                        source: "remote",
                        caption: {
                            background: { colors: ["#3B00EC", "#823FFF"] },
                            icon: { data: "💫", type: "emoji" },
                            max_lines: 1,
                            text: "Xin chào 2027!",
                            localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" },
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:new_years_day_2027_alternate",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF0062", "#FF783F"] },
                            max_lines: 1,
                            text: "2027",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Decorative by Locket",
                items: [
                    {
                        overlay_id: "caption:party_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#5EFFF5", "#FCFF57"] },
                            icon: { data: "🪩", type: "emoji" },
                            max_lines: 1,
                            text: "Party Time!",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:good_morning",
                        source: "remote",
                        daily_start_hour: 5,
                        daily_end_hour: 10,
                        caption: {
                            background: { colors: ["#EF7402", "#EABF0F"] },
                            icon: { data: "☀️", type: "emoji" },
                            max_lines: 1,
                            text: "Good morning",
                            text_color: "#FFFFFFE5",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:goodnight",
                        source: "remote",
                        daily_start_hour: 19.5,
                        daily_end_hour: 24,
                        caption: {
                            background: { colors: ["#370C6F", "#575CD4"] },
                            icon: { data: "🌙", type: "emoji" },
                            max_lines: 1,
                            text: "Goodnight",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ootd",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFFFFF", "#DBDBDB"] },
                            icon: { data: "🕶", type: "emoji" },
                            max_lines: 1,
                            text: "OOTD",
                            text_color: "#101010E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:miss_you",
                        source: "remote",
                        caption: {
                            background: { colors: ["#EC0C00", "#FF493F"] },
                            icon: { data: "🥰", type: "emoji" },
                            max_lines: 1,
                            text: "Miss you",
                            text_color: "#FFFFFFDB",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "Locket Gold by PBL🎨",
                items: [
                    {
                        overlay_id: "caption:pbl",
                        source: "remote",
                        caption: {
                            background: { colors: ["#B8E7FF", "#A8F5D0", "#DCCBFF"] },
                            max_lines: 1,
                            text: "phambaolong",
                            text_color: "#183153",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:feeling_cute",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F8BBD0", "#E91E63"] },
                            icon: { data: "🌷", type: "emoji" },
                            max_lines: 1,
                            text: "Feeling Cute",
                            localized_text: { en: "Feeling Cute", vn: "Cảm thấy dthw" },
                            text_color: "#FFFFFFE5",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFD6A5", "#FFF1A8", "#FFC4D6"] },
                            max_lines: 1,
                            text: "Cu 🐎",
                            text_color: "#633B24",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:tuat",
                        source: "remote",
                        caption: {
                            background: { colors: ["#2C1A0E", "#5D4037", "#D7A86E"] },
                            icon: { data: "🐕", type: "emoji" },
                            max_lines: 1,
                            text: "Tuất",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:wedding_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFE4E1", "#E73C7E"] },
                            icon: { data: "💍", type: "emoji" },
                            max_lines: 1,
                            text: "Wedding Time!",
                            localized_text: { en: "Wedding Time!", vn: "Đám cưới nè!" },
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cam_thay_hanh_phuc",
                        source: "remote",
                        caption: {
                            background: { colors: ["#EC407A", "#F8BBD0"] },
                            icon: { data: "🇻🇳", type: "emoji" },
                            max_lines: 1,
                            text: "Cảm thấy hạnh phúc",
                            localized_text: { en: "Feeling Happy", vn: "Cảm thấy hạnh phúc" },
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:coffee_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#4E342E", "#8D6E63"] },
                            icon: { data: "☕", type: "emoji" },
                            max_lines: 1,
                            text: "Coffee Time!",
                            localized_text: { en: "Coffee Time!", vn: "Giờ uống cà phê!" },
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:snake_vibes",
                        source: "remote",
                        caption: {
                            background: { colors: ["#2E7D32", "#66BB6A"] },
                            icon: { data: "🐍", type: "emoji" },
                            max_lines: 1,
                            text: "Snake Vibes",
                            localized_text: { en: "Snake Vibes", vn: "Chất rắn" },
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:mixue_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFF9C4", "#F8BBD0"] },
                            icon: { data: "🍦", type: "emoji" },
                            max_lines: 1,
                            text: "Mixue Time!",
                            localized_text: { en: "Mixue Time!", vn: "Giờ Mixue!" },
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:locket_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#ECEFF1", "#B3E5FC"] },
                            icon: { data: "📷", type: "emoji" },
                            max_lines: 1,
                            text: "Locket Time!",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cinema_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#1A237E", "#455A64"] },
                            icon: { data: "🎬", type: "emoji" },
                            max_lines: 1,
                            text: "Cinema Time!",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:dating_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#E91E63", "#F44336"] },
                            icon: { data: "💕", type: "emoji" },
                            max_lines: 1,
                            text: "Dating Time!",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:graduation_day",
                        source: "remote",
                        caption: {
                            background: { colors: ["#1A237E", "#283593"] },
                            icon: { data: "🎓", type: "emoji" },
                            max_lines: 1,
                            text: "Happy Graduation Day!",
                            localized_text: { en: "Happy Graduation Day!", vn: "Chúc mừng tốt nghiệp!" },
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:shopping_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#B3E5FC", "#FFFFFF"] },
                            icon: { data: "🛍️", type: "emoji" },
                            max_lines: 1,
                            text: "Shopping Time!",
                            localized_text: { en: "Shopping Time!", vn: "Giờ mua sắm!" },
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:dinner_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFCCBC", "#FF8A80"] },
                            icon: { data: "🍽️", type: "emoji" },
                            max_lines: 1,
                            text: "Dinner Time!",
                            localized_text: { en: "Dinner Time!", vn: "Giờ ăn tối!" },
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:chilling_time",
                        source: "remote",
                        caption: {
                            background: { colors: ["#E1BEE7", "#F8BBD0"] },
                            icon: { data: "🌴", type: "emoji" },
                            max_lines: 1,
                            text: "Chilling Time!",
                            localized_text: { en: "Chilling Time!", vn: "Giờ thư giãn!" },
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Độc lạ",
                items: [
                    {
                        overlay_id: "caption:xin_vinh_biet_cu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#232526", "#414345"] },
                            icon: { data: "🕯️", type: "emoji" },
                            max_lines: 1,
                            text: "Xin vĩnh biệt cụ",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:chay_ngay_di",
                        source: "remote",
                        caption: {
                            background: { colors: ["#D31027", "#EA384D"] },
                            icon: { data: "🏃💨", type: "emoji" },
                            max_lines: 1,
                            text: "Chạy ngay đi",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:luc_nao_co_tien_thi_moi_di_a",
                        source: "remote",
                        caption: {
                            background: { colors: ["#0F2027", "#203A43", "#2C5364"] },
                            icon: { data: "💸", type: "emoji" },
                            max_lines: 1,
                            text: "Lúc nào có tiền thì mới đi á",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cu_tu_tu_khoai_se_nhu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#56AB2F", "#A8E063"] },
                            icon: { data: "🥔", type: "emoji" },
                            max_lines: 1,
                            text: "Cứ từ từ khoai sẽ nhừ",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:kiem_tra_nhan_pham",
                        source: "remote",
                        caption: {
                            background: { colors: ["#654EA3", "#EAAFC8"] },
                            icon: { data: "🎲", type: "emoji" },
                            max_lines: 1,
                            text: "Kiểm tra nhân phẩm",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:doc_so_tai_khoan",
                        source: "remote",
                        caption: {
                            background: { colors: ["#1E90FF", "#00D4FF"] },
                            icon: { data: "💳", type: "emoji" },
                            max_lines: 1,
                            text: "đọc số tài khoản",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ai_so_thi_di_ve",
                        source: "remote",
                        caption: {
                            background: { colors: ["#B71C1C", "#FF5722"] },
                            icon: { data: "🏃", type: "emoji" },
                            max_lines: 1,
                            text: "ai sợ thì đi về",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:con_cai_nit",
                        source: "remote",
                        caption: {
                            background: { colors: ["#D7CCC8", "#8D6E63"] },
                            icon: { data: "🧶", type: "emoji" },
                            max_lines: 1,
                            text: "còn cái nịt",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:canh_bao_co_hat",
                        source: "remote",
                        caption: {
                            background: { colors: ["#9C27B0", "#E91E63"] },
                            icon: { data: "🎤", type: "emoji" },
                            max_lines: 1,
                            text: "cảnh báo có hát",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:than_chua_ma_don",
                        source: "remote",
                        caption: {
                            background: { colors: ["#607D8B", "#37474F"] },
                            icon: { data: "😔", type: "emoji" },
                            max_lines: 1,
                            text: "Thân chưa mà dỡn",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ai_muon",
                        source: "remote",
                        caption: {
                            background: { colors: ["#E91E63", "#F44336"] },
                            icon: { data: "🤔", type: "emoji" },
                            max_lines: 1,
                            text: "Ai mượn?",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:hay_ra_de_qua_a",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFF59D", "#80DEEA"] },
                            icon: { data: "🥺", type: "emoji" },
                            max_lines: 1,
                            text: "Hay ra dẻ quá à!",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:giam_suc_manh_con_tuong",
                        source: "remote",
                        caption: {
                            background: { colors: ["#4CAF50", "#00BCD4"] },
                            icon: { data: "🎮", type: "emoji" },
                            max_lines: 1,
                            text: "Giảm sức mạnh con tướng",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:mac_co_qua_hai_oi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFB74D", "#F8BBD0"] },
                            icon: { data: "😭", type: "emoji" },
                            max_lines: 1,
                            text: "Mắc cỡ quá hai ơi",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:minh_la_lop",
                        source: "remote",
                        caption: {
                            background: { colors: ["#263238", "#455A64"] },
                            icon: { data: "🛞", type: "emoji" },
                            max_lines: 1,
                            text: "Mình là lốp",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:dep_trai_co_gi_sai",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF5722", "#FFC107"] },
                            icon: { data: "😎", type: "emoji" },
                            max_lines: 1,
                            text: "Đẹp trai có gì sai",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:mong_ton_hoa_sen",
                        source: "remote",
                        caption: {
                            background: { colors: ["#D8B4E2", "#F8BBD0"] },
                            icon: { data: "🪷", type: "emoji" },
                            max_lines: 1,
                            text: "Mong tôn hoa sen thấy cảnh này",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:dam_nhau_khong",
                        source: "remote",
                        caption: {
                            background: { colors: ["#E53935", "#FF7043"] },
                            icon: { data: "🥊", type: "emoji" },
                            max_lines: 1,
                            text: "đấm nhau không",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:sieu_cap_ba_khi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#EC407A", "#F44336"] },
                            icon: { data: "🐉", type: "emoji" },
                            max_lines: 1,
                            text: "siêu cấp bá khí",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:du_an_ma",
                        source: "remote",
                        caption: {
                            background: { colors: ["#263238", "#455A64"] },
                            icon: { data: "👻", type: "emoji" },
                            max_lines: 1,
                            text: "dự án ma",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:doi_roi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF5F6D", "#FFC371"] },
                            icon: { data: "😤", type: "emoji" },
                            max_lines: 1,
                            text: "Dỗi rồi",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:dang_ban_tuong_tu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#1A2980", "#26D0CE"] },
                            icon: { data: "💭", type: "emoji" },
                            max_lines: 1,
                            text: "Đang bận tương tư",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:mo_hon_nhung_tam_hien",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFB75E", "#ED8F03"] },
                            icon: { data: "🐤", type: "emoji" },
                            max_lines: 1,
                            text: "Mỏ hỗn nhưng tâm hiền",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:muon_duoc_om",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF9A9E", "#FECFEF"] },
                            icon: { data: "🫂", type: "emoji" },
                            max_lines: 1,
                            text: "Muốn được ôm",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                ]
            },
            {
                section: "🎨 Trend TikTok",
                items: [
                    {
                        overlay_id: "caption:hoi_chieu_troi_mua",
                        source: "remote",
                        caption: {
                            background: { colors: ["#546E7A", "#263238"] },
                            icon: { data: "🌧️", type: "emoji" },
                            max_lines: 1,
                            text: "Hồi chiều trời mưa...",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:con_vien_la_lan",
                        source: "remote",
                        caption: {
                            background: { colors: ["#12C2E9", "#F64F59"] },
                            icon: { data: "🍂", type: "emoji" },
                            max_lines: 1,
                            text: "côn viên lá làn",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:gian_dang_iu_hong",
                        source: "remote",
                        caption: {
                            background: { colors: ["#3E2723", "#6D4C41", "#A1887F"] },
                            icon: { data: "🪳", type: "emoji" },
                            max_lines: 1,
                            text: "Gián đáng iu hong",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:nau_xoi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#7B1FA2", "#E91E63", "#FFB74D"] },
                            icon: { data: "🙀", type: "emoji" },
                            max_lines: 1,
                            text: "Nấu xói",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:co_tien_lam_phien_thien_ha",
                        source: "remote",
                        caption: {
                            background: { colors: ["#0F0C29", "#302B63", "#F7971E", "#FFD200"] },
                            icon: { data: "💰", type: "emoji" },
                            max_lines: 1,
                            text: "Có tiền làm phiền thiên hạ",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:nguoi_im_lang_gap_nguoi_hay_noi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#232526", "#414345", "#6C7A89", "#B0BEC5"] },
                            icon: { data: "🤐", type: "emoji" },
                            max_lines: 1,
                            text: "Người im lặng gặp người hay nói",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:roi_let_luon",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF9A9E", "#FECFEF", "#FBC2EB", "#A6C1EE"] },
                            icon: { data: "💅", type: "emoji" },
                            max_lines: 1,
                            text: "rồi lét luôn",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:roi_gay_luon",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF6EC7", "#7873F5", "#4ADEDE", "#FFE66D"] },
                            icon: { data: "🌈", type: "emoji" },
                            max_lines: 1,
                            text: "rồi gay luôn",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:tuyet_doi_khong_nghe",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF416C", "#FF4B2B"] },
                            icon: { data: "🙉", type: "emoji" },
                            max_lines: 1,
                            text: "Tuyệt đối không nghe",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cha_nay_tu_luyen_ghe",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFDEE9", "#B5FFFC", "#FAD0C4", "#FFD1FF"] },
                            icon: { data: "🪞", type: "emoji" },
                            max_lines: 1,
                            text: "Cha này tự luyến ghê",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:co_bien_co_bien",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF512F", "#F09819", "#FFD200"] },
                            icon: { data: "🚨", type: "emoji" },
                            max_lines: 1,
                            text: "Có biến có biến",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:hong_drama",
                        source: "remote",
                        caption: {
                            background: { colors: ["#8A2387", "#E94057", "#F27121"] },
                            icon: { data: "🍿", type: "emoji" },
                            max_lines: 1,
                            text: "Hóng drama",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cuoi_vcl_m_oi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F7971E", "#FFD200", "#FFEE58"] },
                            icon: { data: "😂", type: "emoji" },
                            max_lines: 1,
                            text: "Cười vcl m oi",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:vl_m_oi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#1F1C2C", "#928DAB", "#C9D6FF"] },
                            icon: { data: "😳", type: "emoji" },
                            max_lines: 1,
                            text: "vl m ơi?",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:noi_het_bi_mat_thi_co_yeu_hong",
                        source: "remote",
                        caption: {
                            background: { colors: ["#EE9CA7", "#FFDDE1", "#C6FFDD", "#FBD786"] },
                            icon: { data: "🤫", type: "emoji" },
                            max_lines: 1,
                            text: "Nói hết bị mật thì có yêu hong",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:flex_den_hoi_tho_cuoi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F7971E", "#FFD200"] },
                            icon: { data: "💎", type: "emoji" },
                            max_lines: 1,
                            text: "Flex đến hơi thở cuối",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:overthinking_vai_chuong",
                        source: "remote",
                        caption: {
                            background: { colors: ["#2C3E50", "#4CA1AF"] },
                            icon: { data: "🤯", type: "emoji" },
                            max_lines: 1,
                            text: "Overthinking vai chưởng",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:chan_bo_may_di",
                        source: "remote",
                        caption: {
                            background: { colors: ["#870000", "#190A05"] },
                            icon: { data: "🙄", type: "emoji" },
                            max_lines: 1,
                            text: "Chan bố mày đi",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:oach_xa_lach",
                        source: "remote",
                        caption: {
                            background: { colors: ["#11998E", "#38EF7D"] },
                            icon: { data: "🥬", type: "emoji" },
                            max_lines: 1,
                            text: "oách xà lách",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:lai_phai_lo",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FBD3E9", "#BB377D", "#6A0572"] },
                            icon: { data: "💔", type: "emoji" },
                            max_lines: 1,
                            text: "lại phải lọ",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ua_alo",
                        source: "remote",
                        caption: {
                            background: { colors: ["#8E2DE2", "#4A00E0"] },
                            icon: { data: "📞", type: "emoji" },
                            max_lines: 1,
                            text: "Ủa alo",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ke_chuyen_nghe_choi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#8A2387", "#E94057"] },
                            icon: { data: "🍿", type: "emoji" },
                            max_lines: 1,
                            text: "Kể chuyện nghe chơi",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:hom_nay_toi_buon",
                        source: "remote",
                        caption: {
                            background: { colors: ["#141E30", "#243B55"] },
                            icon: { data: "🥀", type: "emoji" },
                            max_lines: 1,
                            text: "hôm nay tôi buồn",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:xinh_dep_tuyet_voi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FC5C7D", "#6A82FB"] },
                            icon: { data: "💅", type: "emoji" },
                            max_lines: 1,
                            text: "Xinh đẹp tuyệt vời",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:tram_cam_nhe",
                        source: "remote",
                        caption: {
                            background: { colors: ["#1F1C2C", "#928DAB"] },
                            icon: { data: "🫠", type: "emoji" },
                            max_lines: 1,
                            text: "Trầm cảm nhẹ",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:chua_du_wow",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF5349", "#EB0C00"] },
                            icon: { data: "⭐", type: "emoji" },
                            max_lines: 1,
                            text: "Chưa đủ wow",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:boc_trung_sit_rit",
                        source: "remote",
                        caption: {
                            background: { colors: ["#9C27B0", "#7B1FA2"] },
                            icon: { data: "🎁", type: "emoji" },
                            max_lines: 1,
                            text: "Bóc trúng sít rịt",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:hen_lam_moi_xui_duoc_vay_a",
                        source: "remote",
                        caption: {
                            background: { colors: ["#00BCD4", "#0097A7"] },
                            icon: { data: "😅", type: "emoji" },
                            max_lines: 1,
                            text: "Hèn lắm mới xui được vậy á",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ra_duong_ne_moi_anh",
                        source: "remote",
                        caption: {
                            background: { colors: ["#2196F3", "#1976D2"] },
                            icon: { data: "👤", type: "emoji" },
                            max_lines: 1,
                            text: "Ra đường nể mỗi anh",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cung_cung_di",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFC107", "#FFA000"] },
                            icon: { data: "🚀", type: "emoji" },
                            max_lines: 1,
                            text: "Cũng cứng đi",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:tuyet_doi_dien_anh",
                        source: "remote",
                        caption: {
                            background: { colors: ["#455A64", "#263238"] },
                            icon: { data: "📷", type: "emoji" },
                            max_lines: 1,
                            text: "Tuyệt đối điện ảnh",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:du_ba_khi_chua",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF5722", "#E64A19"] },
                            icon: { data: "⚡", type: "emoji" },
                            max_lines: 1,
                            text: "Đủ bá khí chưa",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ua_alo",
                        source: "remote",
                        caption: {
                            background: { colors: ["#9C27B0", "#7B1FA2"] },
                            icon: { data: "❓", type: "emoji" },
                            max_lines: 1,
                            text: "Ủa alo?",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cai_gi_vay_troi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F44336", "#D32F2F"] },
                            icon: { data: "❗", type: "emoji" },
                            max_lines: 1,
                            text: "Cái gì vậy trời",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:nay_la_het_cuu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#607D8B", "#455A64"] },
                            icon: { data: "❌", type: "emoji" },
                            max_lines: 1,
                            text: "Này là hết cứu",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:qua_la_dien_anh",
                        source: "remote",
                        caption: {
                            background: { colors: ["#26A69A", "#00897B"] },
                            icon: { data: "📷", type: "emoji" },
                            max_lines: 1,
                            text: "Quá là điện ảnh",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Gen Z Life 🩻",
                items: [
                    {
                        overlay_id: "caption:hao_han",
                        source: "remote",
                        caption: {
                            background: { colors: ["#114357", "#F29492"] },
                            icon: { data: "🗡️", type: "emoji" },
                            max_lines: 1,
                            text: "Hảo hán",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:cam_lanh",
                        source: "remote",
                        caption: {
                            background: { colors: ["#2193B0", "#6DD5ED"] },
                            icon: { data: "🤧", type: "emoji" },
                            max_lines: 1,
                            text: "Cảm lạnh",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:bat_luc",
                        source: "remote",
                        caption: {
                            background: { colors: ["#2C3E50", "#3498DB"] },
                            icon: { data: "🏳️", type: "emoji" },
                            max_lines: 1,
                            text: "Bất lực",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:xin_lui_duoc_chua",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F6D365", "#FDA085"] },
                            icon: { data: "🥺", type: "emoji" },
                            max_lines: 1,
                            text: "Xin lũi được chưa",
                            text_color: "#000000",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:rot_nuoc_mat",
                        source: "remote",
                        caption: {
                            background: { colors: ["#1CB5E0", "#000046"] },
                            icon: { data: "😭", type: "emoji" },
                            max_lines: 1,
                            text: "Rớt nước mắt",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:guc_nga",
                        source: "remote",
                        caption: {
                            background: { colors: ["#3A1C71", "#D76D77"] },
                            icon: { data: "📉", type: "emoji" },
                            max_lines: 1,
                            text: "Gục ngã",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:tien_dinh",
                        source: "remote",
                        caption: {
                            background: { colors: ["#C33764", "#1D2671"] },
                            icon: { data: "🌪️", type: "emoji" },
                            max_lines: 1,
                            text: "Tiền đình",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:che_manh",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF4E50", "#F9D423"] },
                            icon: { data: "👎", type: "emoji" },
                            max_lines: 1,
                            text: "Chê mạnh",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:xinh_gai_an_phim_1",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F77062", "#FE5196"] },
                            icon: { data: "💅", type: "emoji" },
                            max_lines: 1,
                            text: "Xinh gái ấn phím 1",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:di_lam_vi_dam_me",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FDC830", "#F37335"] },
                            icon: { data: "🤡", type: "emoji" },
                            max_lines: 1,
                            text: "Đi làm vì đam mê",
                            text_color: "#FFFFFF",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Meme vui nhộn",
                items: [
                    {
                        overlay_id: "caption:cuoi_xiu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFEB3B", "#FF9800"] },
                            icon: { data: "😎", type: "emoji" },
                            max_lines: 1,
                            text: "Cười xỉu",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:toang_that_roi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F44336", "#B71C1C"] },
                            icon: { data: "🐉", type: "emoji" },
                            max_lines: 1,
                            text: "Toang thật rồi",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:toi_roi_toi_roi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#673AB7", "#512DA8"] },
                            icon: { data: "❗", type: "emoji" },
                            max_lines: 1,
                            text: "Tới rồi tới rồi",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:khong_the_tin_noi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#00BCD4", "#0097A7"] },
                            icon: { data: "❓", type: "emoji" },
                            max_lines: 1,
                            text: "Không thể tin nổi",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Đời sống",
                items: [
                    {
                        overlay_id: "caption:ngay_moi_vui_ve",
                        source: "remote",
                        caption: {
                            background: { colors: ["#4CAF50", "#2E7D32"] },
                            icon: { data: "☀️", type: "emoji" },
                            max_lines: 1,
                            text: "Ngày mới vui vẻ",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ngu_ngon",
                        source: "remote",
                        caption: {
                            background: { colors: ["#3F51B5", "#1A237E"] },
                            icon: { data: "🌙", type: "emoji" },
                            max_lines: 1,
                            text: "Ngủ ngon",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:an_com_chua",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF9800", "#F57C00"] },
                            icon: { data: "🍽️", type: "emoji" },
                            max_lines: 1,
                            text: "Ăn cơm chưa?",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:di_choi_khong",
                        source: "remote",
                        caption: {
                            background: { colors: ["#E91E63", "#C2185B"] },
                            icon: { data: "✈️", type: "emoji" },
                            max_lines: 1,
                            text: "Đi chơi không?",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Gen Z Slay",
                items: [
                    {
                        overlay_id: "caption:tinh_hoa_hoi_tu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFD700", "#FF8C00"] },
                            icon: { data: "✨", type: "emoji" },
                            max_lines: 1,
                            text: "Tinh hoa hội tụ",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:phu_tinh_khong_phu_ban",
                        source: "remote",
                        caption: {
                            background: { colors: ["#8E2DE2", "#4A00E0"] },
                            icon: { data: "🕶️", type: "emoji" },
                            max_lines: 1,
                            text: "Phụ tình không phụ bản",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ngoan_xinh_yeu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFAFBD", "#FFC3A0"] },
                            icon: { data: "🌸", type: "emoji" },
                            max_lines: 1,
                            text: "Ngoan xinh yêu của ai?",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:nhin_la_biet_uy_tin",
                        source: "remote",
                        caption: {
                            background: { colors: ["#2980B9", "#2C3E50"] },
                            icon: { data: "👌", type: "emoji" },
                            max_lines: 1,
                            text: "Nhìn là biết uy tín",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Bất ổn & Khó đỡ",
                items: [
                    {
                        overlay_id: "caption:luon_vui_tuoi",
                        source: "remote",
                        caption: {
                            background: { colors: ["#00F2FE", "#4FACFE"] },
                            icon: { data: "🤡", type: "emoji" },
                            max_lines: 1,
                            text: "Luôn vui tươi",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:bat_on_that_su",
                        source: "remote",
                        caption: {
                            background: { colors: ["#636363", "#A2AB58"] },
                            icon: { data: "🫠", type: "emoji" },
                            max_lines: 1,
                            text: "Bất ổn thật sự",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:khong_cam_xuc",
                        source: "remote",
                        caption: {
                            background: { colors: ["#434343", "#000000"] },
                            icon: { data: "🗿", type: "emoji" },
                            max_lines: 1,
                            text: "Không cảm xúc",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:phu_huynh_dung_xem",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FF0844", "#FFB199"] },
                            icon: { data: "🙈", type: "emoji" },
                            max_lines: 1,
                            text: "Phụ huynh đừng xem",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Check VAR & Hóng hớt",
                items: [
                    {
                        overlay_id: "caption:check_var",
                        source: "remote",
                        caption: {
                            background: { colors: ["#11998E", "#38EF7D"] },
                            icon: { data: "📺", type: "emoji" },
                            max_lines: 1,
                            text: "Check VAR liền",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:qua_nhieu_su_de_thuong",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F38181", "#FCE38A"] },
                            icon: { data: "🎀", type: "emoji" },
                            max_lines: 1,
                            text: "Quá nhiều sự dễ thương",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:mac_bay_tinh_yeu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#EE9CA7", "#FFDDE1"] },
                            icon: { data: "💘", type: "emoji" },
                            max_lines: 1,
                            text: "Mắc bẫy tình yêu",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:song_gio_phu_doi_trai",
                        source: "remote",
                        caption: {
                            background: { colors: ["#3A1C71", "#D76D77"] },
                            icon: { data: "🌪️", type: "emoji" },
                            max_lines: 1,
                            text: "Sóng gió phủ đời trai",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Góc Deadline & Đi Làm",
                items: [
                    {
                        overlay_id: "caption:deadline_ruot",
                        source: "remote",
                        caption: {
                            background: { colors: ["#ED213A", "#93291E"] },
                            icon: { data: "🔥", type: "emoji" },
                            max_lines: 1,
                            text: "Deadline dí tụt quần",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:ca_o_ran_doc",
                        source: "remote",
                        caption: {
                            background: { colors: ["#0F2027", "#1B5E20", "#66BB6A"] },
                            icon: { data: "🐍", type: "emoji" },
                            max_lines: 1,
                            text: "Cả ổ rắn độc",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:tien_dau_ma_tieu",
                        source: "remote",
                        caption: {
                            background: { colors: ["#11998E", "#38EF7D"] },
                            icon: { data: "💸", type: "emoji" },
                            max_lines: 1,
                            text: "Tiền đâu mà tiêu",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:nghien_cuu_khoa_hoc",
                        source: "remote",
                        caption: {
                            background: { colors: ["#0F2027", "#2C5364"] },
                            icon: { data: "☕", type: "emoji" },
                            max_lines: 1,
                            text: "Cần nạp cafein gấp",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            }
        ])
    });
}
    // 1. Danh sách Prompt AI độc quyền của hệ thống DNS VPS (163.223.9.98)
    const DNS_AI_PROMPTS = {
        "stk_tai_tho": "Keep the person's exact face, expression, pose, and background from the photo, and realistically place a cute fluffy white and soft pink plush bunny ears headband sitting naturally on top of their head with matching soft lighting and natural shadows. If there are multiple people, put a matching bunny ears headband on each person cleanly.",
        "stk_mu_ngu_khoc": "Apply the exact cartoon face filter from the reference image to the person's face. 1. A cream-colored pixel-art sleeping hat with thick black pixel outlines and a light cyan fluffy pom-pom on the left side. 2. Large, thin, perfectly round black wire-frame glasses. 3. Two exaggerated glossy cyan-blue anime crying streams. 4. A tiny black spiral doodle on the nose. 5. Two small curved black whisker-like lines on each cheek. Preserve original face and background.",
        "stk_jollibee": "Edit the uploaded photograph. Keep the exact same person from the original image. Change ONLY the person's clothing into a realistic Jollibee restaurant employee uniform: bright red polo, yellow panels, blue-yellow collar, embroidered mascot logo on left chest, dark navy trousers.",
        "stk_nak_ve_than": "Transform the person in the uploaded photograph into a photorealistic real-life cosplay version of Nakroth – Dimensional Guardian from Arena of Valor: signature voluminous layered silver-white spiky hair with center part and shoulder-length side locks, cropped black fitted blazer with white piping, deep royal-blue necktie with gold four-point star, lavender-blue trousers.",
        "stk_gojo_satoru": "Edit the provided reference image while strictly preserving its original framing and crop. Localized character appearance and outfit replacement: spiky silver-white hair, black blindfold covering both eyes, black high-collar Gojo uniform jacket. Photorealistic cosplay.",
        "stk_shopee_food": "Edit the uploaded photograph. Transform the person into a realistic real-life ShopeeFood delivery employee wearing an authentic ShopeeFood rider uniform: vibrant orange delivery jacket with white branding, orange helmet, dark trousers. Ultra-photorealistic."
    };

    // 2. Bộ chọn Filter nhanh qua Tiểu sử (Bio Selector 1..12) chuẩn hệ thống DNS
    const BIO_NUMBER_TO_FILTER = {
        "1": "stk_tai_tho",
        "2": "stk_mu_ngu_khoc",
        "3": "stk_jollibee",
        "4": "stk_nak_ve_than",
        "5": "stk_gojo_satoru",
        "6": "stk_shopee_food",
        "7": "hom_nay_an_gi",
        "8": "pb_cortis_4cut",
        "9": "pb_shinchan_4cut",
        "10": "pb_supperman_4cut",
        "11": "pb_meo_dang_yeu_4cut",
        "12": "frame_ba_khi"
    };

    const SELECTED_FILTER_KEY = "LOCKET_SELECTED_FILTER";

    // =========================================================================
    // 1. CHIỀU RESPONSE (Nhận phản hồi từ Server)
    // =========================================================================
    if (hasResponse) {
        let body = $response.body;

        // 1.1 XỬ LÝ PHẢN HỒI BỘ LỌC AI & PHOTOBOOTH TỪ CLOUD ENGINE
        if (url.includes("generateFilteredImage") || url.includes("createOverlay") || url.includes("generateFilter") || url.includes("applyFilter")) {
            try {
                let resObj = JSON.parse(body || "{}");
                delete resObj.error;
                delete resObj.errors;
                if (resObj.result) {
                    delete resObj.result.error;
                    delete resObj.result.errors;
                }
                $done({
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify(resObj)
                });
                return;
            } catch (_) {
                $done({});
                return;
            }
        }

        // 1.2 REVENUECAT GOLD VIP
        if (url.includes("revenuecat.com")) {
            try {
                // Xử lý gói Offerings (Locket gói năm)
                if (url.includes("/offerings")) {
                    let offObj = {};
                    try {
                        offObj = JSON.parse(body || "{}");
                    } catch (_) {
                        offObj = {};
                    }
                    offObj.current_offering_id = "default";
                    offObj.offerings = [{
                        "description": "Locket Gold VIP",
                        "identifier": "default",
                        "packages": [{
                            "identifier": "$rc_annual",
                            "platform_product_identifier": "locket_3600_1y"
                        }]
                    }];
                    $done({
                        status: 200,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify(offObj)
                    });
                    return;
                }

                // Xử lý Product Entitlement Mapping
                if (url.includes("product_entitlement_mapping")) {
                    $done({
                        status: 200,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            "product_entitlement_mapping": {
                                "locket_3600_1y": {
                                    "entitlements": ["Gold", "locket_gold"]
                                }
                            }
                        })
                    });
                    return;
                }

                let obj = {};
                try {
                    obj = JSON.parse(body || "{}");
                } catch (_) {
                    obj = {};
                }
                if (!obj || typeof obj !== "object") obj = {};
                if (!obj.subscriber) obj.subscriber = {};

                let appUid = "";
                const m = url.match(/\/subscribers\/([^\/\?]+)/);
                if (m && m[1]) appUid = decodeURIComponent(m[1]);
                if (!appUid && hasRequest && $request && $request.body) {
                    try {
                        const reqObj = JSON.parse($request.body);
                        appUid = reqObj.app_user_id || "";
                    } catch (_) {}
                }

                if (appUid && !appUid.startsWith("$RCAnonymousID") && typeof $persistentStore !== "undefined") {
                    $persistentStore.write(appUid, "shadow_locket_uid");
                }

                const purchaseDate = "2024-01-01T00:00:00Z";
                const expiresDate = "2099-12-31T23:59:59Z";
                const nowIso = new Date().toISOString();
                const nowMs = Date.now();

                const goldEntitlement = {
                    "expires_date": expiresDate,
                    "grace_period_expires_date": null,
                    "product_identifier": "locket_3600_1y",
                    "purchase_date": purchaseDate,
                    "is_active": true,
                    "will_renew": true,
                    "period_type": "normal",
                    "latest_purchase_date": purchaseDate,
                    "original_purchase_date": purchaseDate,
                    "store": "app_store",
                    "ownership_type": "PURCHASED",
                    "product_plan_identifier": null
                };

                const goldSub = {
                    "auto_resume_date": null,
                    "billing_issues_detected_at": null,
                    "display_name": "locket_gold_annual",
                    "expires_date": expiresDate,
                    "grace_period_expires_date": null,
                    "is_sandbox": false,
                    "management_url": "https://apps.apple.com/account/subscriptions",
                    "original_purchase_date": purchaseDate,
                    "ownership_type": "PURCHASED",
                    "period_type": "normal",
                    "product_plan_identifier": null,
                    "purchase_date": purchaseDate,
                    "refunded_at": null,
                    "store": "app_store",
                    "unsubscribe_detected_at": null
                };

                obj.request_date = nowIso;
                obj.request_date_ms = nowMs;

                obj.subscriber.entitlements = {
                    "Gold": goldEntitlement,
                    "gold": goldEntitlement,
                    "locket_gold": goldEntitlement,
                    "locket_gold_annual": goldEntitlement,
                    "premium": goldEntitlement,
                    "Premium": goldEntitlement,
                    "pro": goldEntitlement,
                    "Pro": goldEntitlement,
                    "camera_filters": goldEntitlement,
                    "camera_filter": goldEntitlement,
                    "filters": goldEntitlement,
                    "filter": goldEntitlement,
                    "ai_filters": goldEntitlement,
                    "ai_filter": goldEntitlement,
                    "photobooth": goldEntitlement,
                    "vip": goldEntitlement
                };

                obj.subscriber.subscriptions = {
                    "locket_3600_1y": goldSub,
                    "locket_gold_annual": goldSub,
                    "com.locket.gold.annual": goldSub,
                    "com.locket.gold.yearly": goldSub,
                    "locket_gold_yearly": goldSub,
                    "locket_gold_monthly": goldSub
                };

                obj.subscriber.original_purchase_date = purchaseDate;
                obj.subscriber.first_seen = purchaseDate;
                obj.subscriber.original_app_user_id = appUid || "NFxs1WImrgPJkN4wNJjWR150pyY2";

                let respHeaders = Object.assign({}, $response.headers || {});
                delete respHeaders["Content-Encoding"];
                delete respHeaders["content-encoding"];
                delete respHeaders["Content-Length"];
                delete respHeaders["content-length"];
                delete respHeaders["Transfer-Encoding"];
                delete respHeaders["transfer-encoding"];
                delete respHeaders["X-RevenueCat-ETag"];
                delete respHeaders["x-revenuecat-etag"];
                delete respHeaders["ETag"];
                delete respHeaders["etag"];
                respHeaders["Content-Type"] = "application/json; charset=utf-8";

                $done({
                    status: 200,
                    headers: respHeaders,
                    body: JSON.stringify(obj)
                });
                return;
            } catch (e) {
                $done({});
                return;
            }
        }

        // 1.3 MỞ KHÓA FIREBASE REMOTE CONFIG (ĐỒNG BỘ 100% CẤU HÌNH DNS VPS)
        if (url.includes("firebaseremoteconfig")) {
            try {
                let obj = {};
                try {
                    obj = JSON.parse(body || "{}");
                } catch (_) {
                    obj = {};
                }
                if (!obj || typeof obj !== "object") obj = {};

                obj.state = "UPDATE";
                obj.templateVersion = String(Date.now());
                obj.appName = "com.locket.Locket";

                let entries = obj.entries || {};
                entries["cache_ttl_seconds"] = "0";
                entries["client_cache_ttl_sec"] = "0";

                // 1. Bật toàn diện 39 Feature gates
                let fg = {};
                try {
                    fg = JSON.parse(entries["feature_gates"] || "{}");
                } catch (_) {
                    fg = {};
                }
                const gatesToEnable = [
                    "app_icon_picker", "camera_roll", "camera_roll_video", "camera_roll_video_60s",
                    "camera_roll_video_upload", "camera_theme", "locket_views", "long_captions",
                    "longer_video", "longer_video_30s", "photo_library_video", "can_upload_60s_video",
                    "can_record_60s_video", "unlimited_friends", "priority_support", "profile_badge",
                    "profileBadge", "remove_ads", "video", "video_30s", "video_60s", "custom_widget_frames",
                    "streaks", "groups", "camera_filter_sheet", "camera_filters", "camera_filter",
                    "filter", "filters", "photo_filters", "ai_filters", "holiday_effects",
                    "holiday_filters", "ar_filters", "face_filters", "camera_filter_button",
                    "custom_filters", "create_filter", "extended_video_60s"
                ];
                for (const g of gatesToEnable) fg[g] = "enabled";
                entries["feature_gates"] = JSON.stringify(fg);

                // 2. Video dài 45s & Quay phim dài chuẩn DNS VPS
                entries["video_duration"] = "60";
                entries["video_max_duration"] = "60.0";
                entries["gold_max_duration"] = "60.0";
                entries["goldMaxDuration"] = "60.0";
                entries["max_video_duration"] = "60";
                entries["max_video_length"] = "60";
                entries["max_video_length_seconds"] = "60";
                entries["video_length_seconds"] = "60";
                entries["video_duration_seconds"] = "60";
                entries["max_video_duration_seconds"] = "60";
                entries["video_recording_duration_seconds"] = "60";
                entries["can_record_video_duration_seconds"] = "60";
                entries["extended_video_length_seconds"] = "60";
                entries["longer_video_duration_seconds"] = "60";
                entries["longer_videos_enabled"] = "true";
                entries["longer_video_enabled"] = "true";
                entries["can_record_long_video"] = "true";
                entries["long_video_enabled"] = "true";
                entries["longer_video_max_duration"] = "60";
                entries["video_quality_mbps"] = "0.7";
                entries["camera_quality_mbps"] = "0.7";
                entries["video_bitrate"] = "700000";
                entries["camera_volume_button_enabled"] = "true";
                entries["camera_microphone_enabled"] = "true";
                entries["video_sound_enabled"] = "true";

                // 3. Tải Video từ Thư Viện / Camera Roll (45s) chuẩn DNS VPS
                entries["camera_roll_max_duration"] = "60.0";
                entries["camera_roll_video_max_duration"] = "60.0";
                entries["camera_roll_duration"] = "60.0";
                entries["video_trim_max_duration"] = "60.0";
                entries["trim_max_duration"] = "60.0";
                entries["longer_camera_roll_videos_enabled"] = "true";
                entries["camera_roll_video_upload_enabled"] = "true";
                entries["camera_roll_video_enabled"] = "true";
                entries["camera_roll_preview_enabled"] = "true";
                entries["internal_camera_roll_video_upload_enabled"] = "true";
                entries["camera_roll_quality_mbps"] = "0.7";
                entries["camera_roll"] = JSON.stringify({
                    "gold_max_duration": 60.0,
                    "max_duration": 60.0,
                    "video_max_duration": 60.0,
                    "video_length": 60.0,
                    "quality_mbps": 0.6,
                    "video": true,
                    "video_enabled": true,
                    "upload_enabled": true,
                    "allow_video": true
                });
                entries["camera"] = JSON.stringify({
                    "gold_max_duration": 60.0,
                    "max_duration": 60.0,
                    "ultra_wide": true,
                    "video_max_duration": 60.0,
                    "video_duration": 60.0
                });
                entries["camera_config"] = JSON.stringify({
                    "gold_max_duration": 60.0,
                    "max_duration": 60.0,
                    "ultra_wide": true,
                    "video_max_duration": 60.0,
                    "video_duration": 60.0
                });
                entries["max_friends_count"] = "999999";
                entries["signup_max_friends_count"] = "999999";
                entries["unlimited_max_friend_count"] = "999999";
                entries["soft_friend_limit_threshold_count"] = "999999";
                entries["unlimited_friends_prompt_config"] = JSON.stringify({
                    "minimum_friends_count": 0,
                    "show": false
                });

                // 7. Bảo vệ lượt xem Moment, thông báo người xem và thả cảm xúc chuẩn DNS VPS
                entries["get_moment_views_as_cloud_function"] = "false";
                entries["moment_views_enabled"] = "true";
                entries["moment_views_v2"] = "true";
                entries["record_moment_views"] = "true";
                entries["notify_moment_views"] = "true";
                entries["moment_reactions_v2"] = "true";
                entries["fetch_moments_in_conversation"] = "true";
                entries["chat_read_receipts"] = "true";
                entries["chat_read_receipts_mark_as_delivered_extension"] = "true";
                entries["android_mark_moment_as_viewed"] = "true";
                entries["android_get_latest_moment_v2"] = "true";
                entries["get_latest_moment_v2"] = "true";

                // 8. Kích hoạt cờ Locket Gold vĩnh viễn chuẩn DNS VPS
                entries["gold_subscription_override"] = "true";
                entries["android_gold_subscription_override"] = "true";
                entries["is_gold"] = "true";
                entries["has_gold"] = "true";
                entries["gold_active"] = "true";
                entries["v2_refresh"] = "true";

                // 9. Cấu hình khung viền widget ngoài màn hình chính (frame_ba_khi)
                const custom_frame_obj = JSON.stringify({
                    "uid": "pblwidget",
                    "url": "https://i.ibb.co/6JRQprXZ/Khung-Locket-Gold-pbl.png",
                    "placement": "above",
                    "use_local_time_zone": true,
                    "start_at": "2024-01-01T00:00:00",
                    "end_at": "2099-12-31T23:59:59"
                });
                entries["widget_frame_event"] = custom_frame_obj;
                entries["synced_widget_frame"] = custom_frame_obj;
                entries["last_synced_widget_frame_event"] = "pblwidget";
                entries["widget_frame_event_enabled"] = "true";
                entries["widget_frame_enabled"] = "true";
                entries["widget_frame_events_enabled"] = "true";

                // 10. Thông báo Lên Gold & Cảnh báo Chống Scam (Phạm Bảo Long)
                entries["feature_discovery_popup_config"] = JSON.stringify(CUSTOM_POPUP_CONFIG);

                // 11. Vô hiệu hóa Paywall & Upsell chặn áp dụng Filter
                entries["paywall_presentation_config"] = JSON.stringify({
                    "uid": "paywall_testflight",
                    "onboarding": false,
                    "after_sent_moment": false,
                    "after_moment": false,
                    "after_capture": false,
                    "on_foreground": false,
                    "holiday_effects": false,
                    "camera_filters": false,
                    "camera_filter": false,
                    "filters": false,
                    "filter": false,
                    "ai_filter": false,
                    "ai_filters": false,
                    "filtered_image": false,
                    "filtered_images": false,
                    "generate_filtered_image": false,
                    "interval": 2592000,
                    "profile_banner": true
                });
                entries["upsell_features"] = JSON.stringify({
                    "app_icon_picker": false,
                    "camera_roll": false,
                    "camera_theme": false,
                    "locket_views": false,
                    "remove_ads": false,
                    "custom_widget_frames": false,
                    "filter": false,
                    "filters": false,
                    "camera_filter": false,
                    "camera_filters": false,
                    "holiday_filter": false,
                    "holiday_filters": false,
                    "ai_filter": false,
                    "ai_filters": false
                });

                if (entries["paywall_config"]) {
                    try {
                        let pw = JSON.parse(entries["paywall_config"]);
                        pw.completed_title = {
                            en: "Đã lên Gold rồi nhé! ✨",
                            vi: "Đã lên Gold rồi nhé! ✨"
                        };
                        pw.completed_subtitle = {
                            en: "Locket By Phạm Bảo Long - Cảm ơn bạn đã tin tưởng ủng hộ",
                            vi: "Locket By Phạm Bảo Long - Cảm ơn bạn đã tin tưởng ủng hộ"
                        };
                        pw.completed_button_title = {
                            en: "Vào Dùng Ngay",
                            vi: "Vào Dùng Ngay"
                        };
                        entries["paywall_config"] = JSON.stringify(pw);
                    } catch (_) {}
                }

                obj.entries = entries;

                let respHeaders = Object.assign({}, $response.headers || {});
                delete respHeaders["Content-Encoding"];
                delete respHeaders["content-encoding"];
                delete respHeaders["Content-Length"];
                delete respHeaders["content-length"];
                delete respHeaders["Transfer-Encoding"];
                delete respHeaders["transfer-encoding"];
                delete respHeaders["ETag"];
                delete respHeaders["etag"];
                respHeaders["Content-Type"] = "application/json; charset=utf-8";

                $done({
                    status: 200,
                    headers: respHeaders,
                    body: JSON.stringify(obj)
                });
                return;
            } catch (e) {
                $done({});
                return;
            }
        }

        $done({});
        return;
    }

    // =========================================================================
    // 2. CHIỀU REQUEST (Gửi yêu cầu đi)
    // =========================================================================
    const reqUrl = (hasRequest && $request.url) ? $request.url : "";
    let reqHeaders = Object.assign({}, ($request && $request.headers) || {});

    // 2.1 XÓA HEADER CACHE 304 CHO REVENUECAT & FIREBASE REMOTE CONFIG
    if (reqUrl.includes("revenuecat.com") || reqUrl.includes("firebaseremoteconfig")) {
        delete reqHeaders["If-None-Match"];
        delete reqHeaders["if-none-match"];
        delete reqHeaders["If-Modified-Since"];
        delete reqHeaders["if-modified-since"];
        delete reqHeaders["X-RevenueCat-ETag"];
        delete reqHeaders["x-revenuecat-etag"];
        delete reqHeaders["ETag"];
        delete reqHeaders["etag"];
        $done({
            headers: reqHeaders
        });
        return;
    }

    // 2.2 BỘ CHỌN FILTER QUA TIỂU SỬ & CẬP NHẬT PROFILE GOLD
    if (reqUrl.includes("changeProfileInfo")) {
        if (hasRequest && $request.body && typeof $persistentStore !== "undefined") {
            try {
                let bodyText = typeof $request.body === "string" ? $request.body : "";
                if (!bodyText && typeof TextDecoder !== "undefined") {
                    bodyText = new TextDecoder("utf-8").decode($request.body);
                }
                const bodyObj = JSON.parse(bodyText || "{}");
                const dataNode = (bodyObj && bodyObj.data && typeof bodyObj.data === "object") ? bodyObj.data : bodyObj;
                const bioText = String(dataNode.bio || dataNode.status || dataNode.about || "").trim();
                if (bioText === "0" || bioText.toLowerCase() === "off") {
                    $persistentStore.write("", SELECTED_FILTER_KEY);
                } else if (BIO_NUMBER_TO_FILTER[bioText]) {
                    $persistentStore.write(BIO_NUMBER_TO_FILTER[bioText], SELECTED_FILTER_KEY);
                } else if (/^(stk_|pb_|frame_|khung_|photobooth_|hom_nay_)/i.test(bioText)) {
                    $persistentStore.write(bioText, SELECTED_FILTER_KEY);
                }
            } catch (_) {}
        }
        $done({
            response: {
                status: 200,
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    "data": {
                        "badge": "locket_gold",
                        "badge_tier": "gold",
                        "is_gold": true,
                        "success": true
                    },
                    "result": {
                        "badge": "locket_gold",
                        "badge_tier": "gold",
                        "is_gold": true,
                        "success": true
                    }
                })
            }
        });
        return;
    }

    // 2.3 DANH SÁCH BỘ LỌC CHO LOCKET (getFilters / createFilter)
    if (reqUrl.includes("getFilters") || reqUrl.includes("createFilter")) {
        const filterList = (CUSTOM_CAMERA_FILTER_CONFIG && (CUSTOM_CAMERA_FILTER_CONFIG.filters || CUSTOM_CAMERA_FILTER_CONFIG.picker_filters)) || [];
        $done({
            response: {
                status: 200,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    "result": {
                        "data": {
                            "filters": filterList
                        },
                        "status": 200
                    },
                    "data": {
                        "filters": filterList
                    },
                    "status": 200
                })
            }
        });
        return;
    }

    $done({});
})();
