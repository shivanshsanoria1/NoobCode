const solution = {
  quesId: 334,
  title: `Increasing Triplet Subsequence`,
  solutions: [
    `class Solution {
      public:
          void nextGreaterElement(vector<int>& nums, vector<bool>& greater) //maintain the stack in decreasing order
          {
              int n= nums.size();
              stack<int> st; //stack contains indexes and not values
              for(int i=0; i<n; i++)
              {
                  while(!st.empty() && nums[i] > nums[st.top()]) //curr element is greater than element at stack.top
                  {
                      greater[st.top()]=true; //mark the index stack.top in greater[]
                      st.pop();
                  }
                  st.push(i);
              }
          }
          
          void prevSmallerElement(vector<int>& nums, vector<bool>& smaller) //maintain the stack in increasing order
          {
              int n= nums.size();
              stack<int> st; //stack contains indexes and not values
              for(int i=n-1; i>=0; i--)
              {
                  while(!st.empty() && nums[i] < nums[st.top()]) //curr element is smaller than element at stack.top
                  {
                      smaller[st.top()]=true; //mark the index stack.top in smaller[]
                      st.pop();
                  }
                  st.push(i);
              }
          }
          
          bool increasingTriplet(vector<int>& nums) { //T.C.=O(n) , S.C.=O(n)
              int n= nums.size();
              if(n < 3) //atleast 3 numbers are needed
                  return false;
              vector<bool> greater(n,false); //to store nextGreaterElement
              vector<bool> smaller(n,false); //to store prevSmallerElement
              nextGreaterElement(nums,greater);
              prevSmallerElement(nums,smaller);
              for(int i=0; i<n; i++)
                  if(greater[i]==true && smaller[i]==true) //both nextGreaterElement and prevSmallerElement exists
                      return true;
              return false;
          }
      };`,
    `class Solution {
      public:
          bool increasingTriplet(vector<int>& nums) { //T.C.=O(n) , S.C.=O(n)
              int n= nums.size();
              if(n < 3) //atleast 3 numbers are needed
                  return false;
              
              vector<int> left_min(n);
              left_min[0] = nums[0];
              for(int i=1; i<n; i++)
                  left_min[i] = min(left_min[i-1],nums[i]);
              
              vector<int> right_max(n);
              right_max[n-1] = nums[n-1];
              for(int i=n-2; i>=0; i--)
                  right_max[i] = max(right_max[i+1],nums[i]);
              
              for(int i=1; i<n-1; i++)
                  if(left_min[i-1] < nums[i] && nums[i] < right_max[i+1])
                      return true;
              
              return false;
          }
      };`,
    `class Solution {
      public:
          bool increasingTriplet(vector<int>& nums) { //T.C.=O(n) , S.C.=O(1)
              int n= nums.size();
              if(n < 3) //atleast 3 numbers are needed
                  return false;
              int low=INT_MAX, mid=INT_MAX;
              for(int i=0; i<n; i++)
              {
                  if(nums[i] <= low) //new 'low' found
                      low=nums[i];
                  else if(nums[i] <= mid) //new 'mid' found
                      mid=nums[i];
                  else //new 'high' found
                      return true;
              }
              return false;
          }
      };
      // idea is to find 3 numbers such that low < mid < high
      // try to minimise low and mid`
  ],
  unacceptedSolutions: [
    `class Solution {
    public:
        bool increasingTriplet(vector<int>& nums) { //T.C.=O(n^3) , S.C.=O(1)
            int n=nums.size();
            for(int i=0; i<n-2; i++)
                for(int j=i+1; j<n-1; j++)
                    for(int k=j+1; k<n; k++)
                        if(nums[i] < nums[j] && nums[j] < nums[k])
                            return true;
            return false;
        }
    };`,
    `class Solution {
      public:
          bool increasingTriplet(vector<int>& nums) { //T.C.=O(n^2) , S.C.=O(1)
              int n=nums.size();
              if(n < 3) //atleast 3 numbers are needed
                  return false;
              for(int i=1; i<n-1; i++)
              {
                  int left=i-1, right=i+1;
                  bool flag_left=false, flag_right=false;
                  while(left >= 0)
                  {
                      if(nums[left] < nums[i]) //smaller element found in the left subarray
                      {
                          flag_left=true;
                          break;
                      }
                      left--;
                  }
                  while(right < n)
                  {
                      if(nums[i] < nums[right]) //larger element found in the right subarray
                      {
                          flag_right=true;
                          break;
                      }
                      right++;
                  }
                  if(flag_left==true && flag_right==true)
                      return true;
              }
              return false;
          }
      };`
  ]
};