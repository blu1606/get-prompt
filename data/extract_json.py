import re
import json
import os

def extract_prompts(file_path):
    """
    Hàm đọc file markdown và chuyển đổi sang danh sách các object JSON.
    """
    if not os.path.exists(file_path):
        print(f"Lỗi: Không tìm thấy file {file_path}")
        return []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Tách các section dựa trên dấu phân cách ---
    # Sử dụng Regex để đảm bảo tách đúng ngay cả khi có khoảng trắng
    sections = re.split(r'\n---\n', content)
    
    results = []
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
            
        item = {}
        
        # 1. Trích xuất ID và Title (Pattern: ## 1. Title)
        title_match = re.search(r'## (\d+)\. (.+)', section)
        if title_match:
            item['id'] = int(title_match.group(1))
            item['title'] = title_match.group(2).strip()
        else:
            # Nếu không có tiêu đề đúng định dạng, bỏ qua section này
            continue
            
        # 2. Trích xuất Prompt (Nằm trong khối ``` ... ``` ngay sau **Prompt:**)
        # Hỗ trợ cả khối code có định dạng ngôn ngữ (như ```json) hoặc không có
        prompt_match = re.search(r'\*\*Prompt:\*\*\s*\n```(?:\w+)?\n(.*?)\n```', section, re.DOTALL)
        if prompt_match:
            item['prompt'] = prompt_match.group(1).strip()
        else:
            # Trường hợp dự phòng nếu prompt không nằm trong khối code
            prompt_match_alt = re.search(r'\*\*Prompt:\*\*\s*\n(.*?)(?=\n\n|\Z)', section, re.DOTALL)
            if prompt_match_alt:
                item['prompt'] = prompt_match_alt.group(1).strip()
            else:
                item['prompt'] = ""
        
        # 3. Trích xuất Image URL (Pattern: ![image](URL))
        image_match = re.search(r'!\[image\]\((.*?)\)', section)
        if image_match:
            item['image'] = image_match.group(1).strip()
        else:
            item['image'] = ""
            
        # 4. Trích xuất Source URL (Pattern: [Source](URL))
        source_match = re.search(r'\[Source\]\((.*?)\)', section)
        if source_match:
            item['source'] = source_match.group(1).strip()
        else:
            item['source'] = ""
            
        # 5. Trích xuất Description (Phần văn bản nằm giữa Title và Prompt)
        if title_match:
            desc_start = title_match.end()
            prompt_label_index = section.find('**Prompt:**')
            if prompt_label_index != -1:
                description = section[desc_start:prompt_label_index].strip()
                item['description'] = description
            else:
                item['description'] = ""

        results.append(item)
        
    return results

def main():
    input_file = '725-prompts-new.md'
    output_file = 'prompts.json'
    
    print(f"🚀 Đang bắt đầu trích xuất dữ liệu từ: {input_file}...")
    
    prompts = extract_prompts(input_file)
    
    if prompts:
        # Lưu file JSON với định dạng đẹp (indent=2) và hỗ trợ tiếng Việt (ensure_ascii=False)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(prompts, f, ensure_ascii=False, indent=2)
            
        print(f"✅ Thành công! Đã trích xuất {len(prompts)} prompts.")
        print(f"📂 File kết quả: {os.path.abspath(output_file)}")
    else:
        print("❌ Không tìm thấy dữ liệu nào để trích xuất.")

if __name__ == "__main__":
    main()
